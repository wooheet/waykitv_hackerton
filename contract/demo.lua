mylib = require "mylib"
--must start with mylib = require "mylib". Be sure to put it in the first line. If the first line is left blank, an exception will be reported.

--Define calling smart contract events
METHOD = {
    INITIALIZE_GAME  = 0x01,
    BET_WICC = 0x02,
    END_GAME = 0x03,
    TEST = 0x04
}

Unpack = function (t,i)
    i = i or 1
    if t[i] then
      return t[i], Unpack(t,i+1)
    end
end

--Write date into the blockChain
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

--get external call context
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

---------------------------------------------------

slice_arr = function (arr, start, len)
    local newArr = {}
    local i = 1
    for i = 1,len do
        newArr[i] = arr[start+i-1]
    end
    return newArr
end

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

    WriteStrkeyValueToDb("GAME_STATE:REMAIN_BALANCE",{mylib.QueryAccountBalance(Unpack({mylib.GetScriptID()}))})

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

        totalRewardAmount = totalRewardAmount + my_reward
        WriteStrkeyValueToDb("GAME_RESULT:"..targetID,{mylib.IntegerToByte8(my_reward)})
    end

    local totalPaybackAmount = 0;
    for i=1,#voter_list[loser_side] do
        if(#voter_list[loser_side]<1) then break end
        local targetID = voter_list[loser_side][i]
        local VOTE_AMOUNT = mylib.ByteToInteger(mylib.ReadData("VOTE_DATA:"..targetID..":AMOUNT"))
        local my_payback = math.floor(loser_pool * VOTE_AMOUNT / givenSum[loser_side]);

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

    local regidTbl = {mylib.GetScriptID()}
end

GetPrizePoolBalance = function()

    local regidTbl = {mylib.GetScriptID()}
    assert(#regidTbl > 0," GetScriptID err")

    local balanceTbl =
    assert(#balanceTbl == 8,"QueryAccountBalance err");

    return mylib.ByteToInteger(Unpack(balanceTbl))
end

WriteAccountData = function (opType, addrType, accountIdTbl, moneyTbl)
    local writeOutputTbl = {
        addrType = addrType,
        accountIdTbl = accountIdTbl,
        operatorType = opType,
        outHeight = 0,
        moneyTbl = moneyTbl
    }
    assert(mylib.WriteOutput(writeOutputTbl),"WriteAccountData" .. opType .. " err")
end


TransferToAddr = function (addrType, accTbl, moneyTbl)
    assert(TableIsNotEmpty(accTbl), "WriteWithdrawal accTbl empty")
    assert(TableIsNotEmpty(moneyTbl), "WriteWithdrawal moneyTbl empty")
    WriteAccountData(OP_TYPE.ADD_FREE, addrType, accTbl, moneyTbl)
    local appRegId = {mylib.GetScriptID()}
    WriteAccountData(OP_TYPE.SUB_FREE, ADDR_TYPE.REGID, appRegId, moneyTbl)
    return true
end

--Entry function of smart contract
Main = function()
    if contract[2] == METHOD.INITIALIZE_GAME then
        initialize_game(
            GetContractTxParam(3,34),
            GetContractTxParam(37,34),
            GetContractTxParam(71,4)
        )
    elseif contract[2] == METHOD.BET_WICC then
        bet_wicc( GetContractTxParam(3,1) )
    elseif contract[2] == METHOD.END_GAME then
        end_game()
    elseif contract[2] == METHOD.TEST then
        mylib_GetCurTxPayAmount()
    else
        error('method# '..string.format("%02x", contract[2])..' not found')
    end
end

Main()
