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
    
    local TOTAL_VOTER_int = mylib.ByteToInteger(Unpack(GAME_STATE.TOTAL_VOTER)) + 1;
    WriteStrkeyValueToDb("GAME_STATE:TOTAL_VOTER",{mylib.IntegerToByte8(TOTAL_VOTER_int)})
    
    local callerAddr = {mylib.GetCurTxAccount()}
    local payAmount = {mylib.GetCurTxPayAmount()}
    
    local insertTable = {};
    for i=1,6 do insertTable[i] = callerAddr[i] end
    for i=1,8 do insertTable[i+6] = payAmount[i] end
    insertTable[15] = target_bj[1]
    
    WriteStrkeyValueToDb("VOTE_DATA:"..TOTAL_VOTER_int,insertTable)
end

end_game = function()
    local GAME_STATE = {
        STATUS_FLAG = mylib.ReadData("GAME_STATE:STATUS_FLAG"),
        END_DATE = {mylib.ReadData("GAME_STATE:END_DATE")},
        TOTAL_VOTER = {mylib.ReadData("GAME_STATE:TOTAL_VOTER")}
    }
    assert(GAME_STATE.STATUS_FLAG == 1, "The game has ended already or hasnt initialized");
    -- assert(GAME_STATE.END_DATE < NOW_TIMESTAMP, "The time is not done yet");
    
    for i=1,mylib.ByteToInteger(Unpack(GAME_STATE.TOTAL_VOTER)) do
        local VOTE_DATA = {mylib.ReadData("VOTE_DATA:"..i)};
        local VOTE_DATA_VOTER = slice_arr(VOTE_DATA,1,6);
        local VOTE_DATA_AMOUNT = slice_arr(VOTE_DATA,7,8);
        local VOTE_DATA_TARGET = slice_arr(VOTE_DATA,15,1);
        WriteStrkeyValueToDb("VOTE_DATA:"..i..":VOTER",VOTE_DATA_VOTER)
        WriteStrkeyValueToDb("VOTE_DATA:"..i..":AMOUNT",VOTE_DATA_AMOUNT)
        WriteStrkeyValueToDb("VOTE_DATA:"..i..":TARGET",VOTE_DATA_TARGET)
    end
    
end

storage = function ()
    
    WriteStrkeyValueToDb("RESULT_LOG:WINNER_BJ",test)
end

test = function(args) 
    WriteStrkeyValueToDb("TEST",args)
end

--Entry function of smart contract
Main = function()
    
    if contract[2] == METHOD.INITIALIZE_GAME then
        initialize_game(
            GetContractTxParam(3,6),
            GetContractTxParam(9,6),
            GetContractTxParam(15,6)
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