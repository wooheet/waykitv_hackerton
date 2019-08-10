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
        TOTAL_VOTER = {mylib.ReadData("GAME_STATE:TOTAL_VOTER")}
    }
    assert(GAME_STATE.STATUS_FLAG == 1, "Game should be initialized");
    -- assert(GAME_STATE.END_DATE > NOW_TIMESTAMP, "The game ended");

    local nextID = mylib.ByteToInteger(Unpack(GAME_STATE.TOTAL_VOTER)) + 1;
    WriteStrkeyValueToDb("GAME_STATE:TOTAL_VOTER",{mylib.IntegerToByte8(nextID)})

    local callerAddr = {mylib.GetBase58Addr(mylib.GetCurTxAccount())}
    local payAmount = {mylib.GetCurTxPayAmount()}

    WriteStrkeyValueToDb("VOTE_DATA:"..nextID..":VOTER",callerAddr)
    WriteStrkeyValueToDb("VOTE_DATA:"..nextID..":AMOUNT",payAmount)
    WriteStrkeyValueToDb("VOTE_DATA:"..nextID..":TARGET",target_bj)
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

    WriteStrkeyValueToDb("GAME_RESULT:REWARDS",{mylib.IntegerToByte8(totalRewardAmount)})

    local totalPaybackAmount = 0;
    for i=1,#voter_list[loser_side] do
        if(#voter_list[loser_side]<1) then break end
        local targetID = voter_list[loser_side][i]
        local VOTE_AMOUNT = mylib.ByteToInteger(mylib.ReadData("VOTE_DATA:"..targetID..":AMOUNT"))
        local my_payback = math.floor(loser_pool * VOTE_AMOUNT / givenSum[loser_side]);

        totalPaybackAmount = totalPaybackAmount + VOTE_AMOUNT
        WriteStrkeyValueToDb("GAME_RESULT:"..targetID,{mylib.IntegerToByte8(my_payback)})
    end

    WriteStrkeyValueToDb("GAME_RESULT:PAYBACK",{mylib.IntegerToByte8(totalPaybackAmount)})

    local fee = Math.floor(total_bet - winner_reward - season_pool - totalRewardAmount - totalPaybackAmount)

    WriteStrkeyValueToDb("GAME_RESULT:TOTAL_BET",{mylib.IntegerToByte8(total_bet)})
    WriteStrkeyValueToDb("GAME_RESULT:WINNER_EARN",{mylib.IntegerToByte8(winner_reward)})
    WriteStrkeyValueToDb("GAME_RESULT:SEASON_POOL",{mylib.IntegerToByte8(season_pool)})
    WriteStrkeyValueToDb("GAME_RESULT:TOTAL_REWARDS",{mylib.IntegerToByte8(totalRewardAmount)})
    WriteStrkeyValueToDb("GAME_RESULT:TOTAL_PAYBACK",{mylib.IntegerToByte8(totalPaybackAmount)})
    WriteStrkeyValueToDb("GAME_RESULT:WAYKITV_FEE",{mylib.IntegerToByte8(fee)})
end

storage = function ()
        assert(false, "voten_side : "..voten_side..", voten_side_b : "..voten_side_b)
    for i=1,#voter_list[winner_side] do
        totalRewardAmount = totalRewardAmount + voter_list[winner_side][i].AMOUNT
    end

    WriteStrkeyValueToDb("RESULT_LOG:WINNER_BJ",test)
end

test = function(args)
    WriteStrkeyValueToDb("TEST",args)
end

--Entry function of smart contract
Main = function()

    if contract[2] == METHOD.INITIALIZE_GAME then
        initialize_game(
            GetContractTxParam(3,17),
            GetContractTxParam(20,17),
            GetContractTxParam(37,4)
        )

    elseif contract[2] == METHOD.BET_WICC then
        bet_wicc(
            GetContractTxParam(3,1)
        )

    elseif contract[2] == METHOD.END_GAME then
        end_game()

    elseif contract[2] == METHOD.TEST then
        mylib_GetCurTxPayAmount()

    else
        error('method# '..string.format("%02x", contract[2])..' not found')
    end

end

Main()
