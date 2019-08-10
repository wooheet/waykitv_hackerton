mylib = require "mylib"


------- CONSTANTS -------

METHOD = {
    INITIALIZE_GAME  = 0x01,
    BET_WICC = 0x02,
    END_GAME = 0x03,
    TEST = 0x04
}


------- COMMON FUNCTIONS -------

Unpack = function (t,i)
    i = i or 1
    if t[i] then
      return t[i], Unpack(t,i+1)
    end
end

WriteStrkeyValueToDb = function (Strkey,ValueTbl)
    local t = type(ValueTbl)
    assert(t == "table","the type of Value isn't table.")

    local writeTbl = {
        key = Strkey,
        length = #ValueTbl,
        value = {}
    }
    writeTbl.value = ValueTbl

    if not mylib.WriteData(writeTbl) then  error("WriteData error") end
end

GetContractTxParam = function (startIndex, length)
    assert(startIndex > 0, "GetContractTxParam start error(<=0).")
    assert(length > 0, "GetContractTxParam length error(<=0).")
    assert(startIndex+length-1 <= #contract, "GetContractTxParam length ".. length .." exceeds limit: " .. #contract)

    local newTbl = {}
    local i = 1
    for i = 1,length do
        newTbl[i] = contract[startIndex+i-1]
    end
    return newTbl
end


------- CUSTOM FUNCTIONS -------

initialize_game = function(host_bj,guest_bj,end_date)
    local GAME_STATE = {
        STATUS_FLAG = mylib.ReadData("GAME_STATE:STATUS_FLAG")
    }
    assert(GAME_STATE.STATUS_FLAG ~= 0x01, "Game has initialized already");

    WriteStrkeyValueToDb("GAME_STATE:STATUS_FLAG",{0x01})
    WriteStrkeyValueToDb("GAME_STATE:HOST_BJ",host_bj)
    WriteStrkeyValueToDb("GAME_STATE:GUEST_BJ",guest_bj)
    WriteStrkeyValueToDb("GAME_STATE:END_DATE",end_date)

    WriteStrkeyValueToDb("GAME_STATE:TOTAL_VOTER",{0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00})
    WriteStrkeyValueToDb("GAME_STATE:HOST_VOTER",{0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00})
    WriteStrkeyValueToDb("GAME_STATE:GUEST_VOTER",{0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00})
end

bet_wicc = function(target_bj)
    local GAME_STATE = {
        STATUS_FLAG = mylib.ReadData("GAME_STATE:STATUS_FLAG"),
        END_DATE = {mylib.ReadData("GAME_STATE:END_DATE")},
        TOTAL_VOTER = {mylib.ReadData("GAME_STATE:TOTAL_VOTER")},
        HOST_VOTER = {mylib.ReadData("GAME_STATE:HOST_VOTER")},
        GUEST_VOTER = {mylib.ReadData("GAME_STATE:GUEST_VOTER")}
    }
    assert(GAME_STATE.STATUS_FLAG == 1, "Game should be initialized");
    -- assert(GAME_STATE.END_DATE > NOW_TIMESTAMP, "The game ended");

    local nextID = mylib.ByteToInteger(Unpack(GAME_STATE.TOTAL_VOTER)) + 1;

    local callerAddr = {mylib.GetBase58Addr(mylib.GetCurTxAccount())}
    local payAmount = {mylib.GetCurTxPayAmount()}

    WriteStrkeyValueToDb("VOTE_DATA:"..nextID..":VOTER",callerAddr)
    WriteStrkeyValueToDb("VOTE_DATA:"..nextID..":AMOUNT",payAmount)
    WriteStrkeyValueToDb("VOTE_DATA:"..nextID..":TARGET",target_bj)

    local vote_check = mylib.ReadData("VOTE_DATA:"..nextID..":TARGET")

    WriteStrkeyValueToDb("GAME_STATE:TOTAL_VOTER",{mylib.IntegerToByte8(nextID)})
    if (vote_check == 0x01) then
        local host_voter = mylib.ByteToInteger(Unpack(GAME_STATE.HOST_VOTER)) + 1;
        WriteStrkeyValueToDb("GAME_STATE:HOST_VOTER",{mylib.IntegerToByte8(host_voter)})
    else
        local guest_voter = mylib.ByteToInteger(Unpack(GAME_STATE.GUEST_VOTER)) + 1;
        WriteStrkeyValueToDb("GAME_STATE:GUEST_VOTER",{mylib.IntegerToByte8(guest_voter)})
    end
end

end_game = function()
    local GAME_STATE = {
        STATUS_FLAG = mylib.ReadData("GAME_STATE:STATUS_FLAG"),
        END_DATE = {mylib.ReadData("GAME_STATE:END_DATE")},
        TOTAL_VOTER = {mylib.ReadData("GAME_STATE:TOTAL_VOTER")}
    }
    assert(GAME_STATE.STATUS_FLAG == 1, "The game has ended already or hasnt initialized");
    -- assert(GAME_STATE.END_DATE < NOW_TIMESTAMP, "The time is not done yet");
    local voter_list = { host = {}, guest = {} }
    local givenSum = { host = 0, guest = 0 };
    for i=1,mylib.ByteToInteger(Unpack(GAME_STATE.TOTAL_VOTER)) do
        local VOTE_DATA = {
            VOTER = mylib.ReadData("VOTE_DATA:"..i..":VOTER"),
            AMOUNT = mylib.ByteToInteger(mylib.ReadData("VOTE_DATA:"..i..":AMOUNT")),
            TARGET = mylib.ReadData("VOTE_DATA:"..i..":TARGET")
        };
        local voten_side = (VOTE_DATA.TARGET == 1) and "host" or "guest"
        givenSum[voten_side] = givenSum[voten_side] + VOTE_DATA.AMOUNT
        voter_list[voten_side][#voter_list[voten_side] + 1] = i
    end

    local RESULT_WINNER = (givenSum.host > givenSum.guest) and 0x01 or 0x02;
    local winner_side = RESULT_WINNER==0x01 and "host" or "guest";
    local loser_side = RESULT_WINNER==0x01 and "guest" or "host";

    WriteStrkeyValueToDb("GAME_RESULT:WINNER",{RESULT_WINNER})

    local total_bet = givenSum.host + givenSum.guest;
    local winner_reward = math.floor(total_bet * 0.1);
    local season_pool = math.floor(total_bet * 0.03);
    local winner_pool = math.floor(total_bet * 0.7);
    local loser_pool = math.floor(total_bet * 0.15);

    local totalRewardAmount = 0;
    for i=1,#voter_list[winner_side] do
        if(#voter_list[winner_side]<1) then break end
        local targetID = voter_list[winner_side][i]
        local VOTE_AMOUNT = mylib.ByteToInteger(mylib.ReadData("VOTE_DATA:"..targetID..":AMOUNT"))
        local my_reward = math.floor(winner_pool * VOTE_AMOUNT / givenSum[winner_side]);

        SendWICC({mylib.ReadData("VOTE_DATA:"..targetID..":VOTER")},{mylib.IntegerToByte8(my_reward)})
        totalRewardAmount = totalRewardAmount + my_reward
        WriteStrkeyValueToDb("GAME_RESULT:"..targetID,{mylib.IntegerToByte8(my_reward)})
    end

    local totalPaybackAmount = 0;
    for i=1,#voter_list[loser_side] do
        if(#voter_list[loser_side]<1) then break end
        local targetID = voter_list[loser_side][i]
        local VOTE_AMOUNT = mylib.ByteToInteger(mylib.ReadData("VOTE_DATA:"..targetID..":AMOUNT"))
        local my_payback = math.floor(loser_pool * VOTE_AMOUNT / givenSum[loser_side]);

        SendWICC({mylib.ReadData("VOTE_DATA:"..targetID..":VOTER")},{mylib.IntegerToByte8(my_payback)})
        totalPaybackAmount = totalPaybackAmount + VOTE_AMOUNT
        WriteStrkeyValueToDb("GAME_RESULT:"..targetID,{mylib.IntegerToByte8(my_payback)})
    end

    --assert(false, "total_bet : ".. total_bet ..", winner_reward : " .. winner_reward ..", season_pool : " .. season_pool ..", totalRewardAmount : " .. totalRewardAmount..", totalPaybackAmount : " .. totalPaybackAmount)
    local fee = math.floor(total_bet - math.floor(winner_reward + season_pool + totalRewardAmount + totalPaybackAmount))

    WriteStrkeyValueToDb("GAME_RESULT:TOTAL_BET",{mylib.IntegerToByte8(total_bet)})
    WriteStrkeyValueToDb("GAME_RESULT:WINNER_EARN",{mylib.IntegerToByte8(winner_reward)})
    WriteStrkeyValueToDb("GAME_RESULT:SEASON_POOL",{mylib.IntegerToByte8(season_pool)})
    WriteStrkeyValueToDb("GAME_RESULT:TOTAL_REWARDS",{mylib.IntegerToByte8(totalRewardAmount)})
    WriteStrkeyValueToDb("GAME_RESULT:TOTAL_PAYBACK",{mylib.IntegerToByte8(totalPaybackAmount)})
    WriteStrkeyValueToDb("GAME_RESULT:WAYKITV_FEE",{mylib.IntegerToByte8(fee)})

    -- SendWICC(SEASON_POOL_CONTRACT,{mylib.IntegerToByte8(season_pool)})
    -- SendWICC(OUR_COMPANY_WALLET,{mylib.IntegerToByte8(fee)}))
end

SendWICC = function(addr, amount)
    local contractAddr = {mylib.GetScriptID()}

    WriteAccountData(2, 1, contractAddr, amount)
    WriteAccountData(1, 2, addr, amount)
end

WriteAccountData = function (opType, addrType, accountIdTbl, moneyTbl)
    local writeOutputTbl = {
        addrType = addrType,
        accountIdTbl = accountIdTbl,
        operatorType = opType,
        outHeight = 0,
        moneyTbl = moneyTbl
    }
    assert(mylib.WriteOutput(writeOutputTbl),"WriteAccountData" .. addrType  .. opType  .. " err")
end

------- MAIN FUNCTION -------

Main = function()
    local method = contract[2]
    if method == METHOD.INITIALIZE_GAME then
        initialize_game(
            GetContractTxParam(3,34),
            GetContractTxParam(37,34),
            GetContractTxParam(71,4)
        )
    elseif method == METHOD.BET_WICC then
        bet_wicc( GetContractTxParam(3,1) )
    elseif method == METHOD.END_GAME then
        end_game()
    elseif method == METHOD.TEST then
        testSending()
    else
        error('method# '..string.format("%02x", method)..' not found')
    end
end

Main()
