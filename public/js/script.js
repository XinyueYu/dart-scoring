var user1_data = {
    scoreset_detail: [],
    scoreset: [],
    score: 301,
    temp_score: 301,
    round: 0,
}
var user2_data = {
    scoreset_detail: [],
    scoreset: [],
    score: 301,
    temp_score: 301,
    round: 0,
}
var temp_scoreset = []
var temp_sum = 0
var round = 1
var count_this_round = 0 // 0 to 6
var count_this_user = 0 // 0 to 3
var user1_mongo = {
    userId: null,
    scoreId: null,
    name: ""
}
var user2_mongo = {
    userId: null,
    scoreId: null,
    name: ""
}

function grabData(idx1, idx2){
    $.get("/users", function(data){
        user1_mongo.userId = data[idx1]._id
        user2_mongo.userId = data[idx2]._id
        user1_mongo.name = data[idx1].name
        user2_mongo.name = data[idx2].name
        $(".user1_board p, #user_name_1").text(user1_mongo.name)
        $(".user2_board p, #user_name_2").text(user2_mongo.name)
        $("#data_card_1 div span").eq(0).text((data[idx1].win_rate * 100).toFixed(2) + "%")
        $("#data_card_1 div span").eq(1).text(data[idx1].win_min_round)
        $("#data_card_1 div span").eq(2).text((data[idx1].win_avg_round * 1).toFixed(2))
        $("#data_card_1 div span").eq(3).text(data[idx1].max_3_darts)
        $("#data_card_1 div span").eq(4).text((data[idx1].avg_3_darts * 1).toFixed(2))
        $("#data_card_2 div span").eq(0).text((data[idx2].win_rate * 100).toFixed(2) + "%")
        $("#data_card_2 div span").eq(1).text(data[idx2].win_min_round)
        $("#data_card_2 div span").eq(2).text((data[idx2].win_avg_round * 1).toFixed(2))
        $("#data_card_2 div span").eq(3).text(data[idx2].max_3_darts)
        $("#data_card_2 div span").eq(4).text((data[idx2].avg_3_darts * 1).toFixed(2))
    })
    $.get("/scores", function(data){
        user1_mongo.scoreId = data[idx1]._id
        user2_mongo.scoreId = data[idx2]._id
    })
}

$(document).ready(function() {
    grabData(2,3)
})

// ---------------------------------------------------------
//                      Handle Success
// ---------------------------------------------------------

function success(user){
    if (user == "user1"){
        $(".end").css("border", "4px solid firebrick")
        $(".play_again").css("background-color", "firebrick")
        $("#winner").text(user1_mongo.name)
        $("#winner").css("color", "firebrick")
    }
    else{
        $(".end").css("border", "4px solid forestgreen")
        $(".play_again").css("background-color", "forestgreen")
        $("#winner").text(user2_mongo.name)
        $("#winner").css("color", "forestgreen")
    }
    $(".end").fadeIn(400)

    $.get("/users/" + user1_mongo.userId, function(data){
        let update_data = {}
        // win_count, win_min_round, win_avg_round
        if (user == "user1"){
            if (data.win_min_round == null){
                update_data["win_min_round"] = round
            }
            else if (round < data.win_min_round){
                update_data["win_min_round"] = round
            }
            if (data.win_avg_round == null){
                update_data["win_avg_round"] = round
            }
            else {
                data.win_avg_round = (data.win_avg_round * data.win_count + round) / (data.win_count + 1)
                update_data["win_avg_round"] = data.win_avg_round
            }
            data.win_count = data.win_count + 1
            update_data["win_count"] = data.win_count
        }
        // total_count
        data.total_count = data.total_count + 1
        update_data["total_count"] = data.total_count
        // win_rate
        update_data["win_rate"] = data.win_count / data.total_count
        // total_round_count
        data.total_round_count = data.total_round_count + user1_data.round
        update_data["total_round_count"] = data.total_round_count
        // sum, max_3_darts, avg_3_dart
        let user1_max = data.max_3_darts
        let user1_max_change = false
        for(let i = 0; i < user1_data.scoreset.length; i++){
            data.sum = data.sum + user1_data.scoreset[i]
            if (user1_data.scoreset[i] > user1_max){
                user1_max = user1_data.scoreset[i]
                user1_max_change = true
            }
        }
        update_data["sum"] = data.sum
        update_data["avg_3_darts"] = data.sum / data.total_round_count
        if (user1_max_change){
            update_data["max_3_darts"] = user1_max
        }
        $.ajax({
            url: '/users/' + user1_mongo.userId,
            type: 'PATCH',
            data: JSON.stringify(update_data),
            dataType: "json",
            contentType: 'application/json; charset=utf-8',
            success: function(res) {
                console.log("Update user1 successfully")
            }
        })
    }).fail(function(status) {
        console.log("failed: " + status)
    })

    $.get("/users/" + user2_mongo.userId, function(data){
        let update_data = {}
        // win_count, win_min_round, win_avg_round
        if (user == "user2"){
            if (data.win_min_round == null){
                update_data["win_min_round"] = round
            }
            else if (round < data.win_min_round){
                update_data["win_min_round"] = round
            }
            if (data.win_avg_round == null){
                update_data["win_avg_round"] = round
            }
            else {
                data.win_avg_round = (data.win_avg_round * data.win_count + round) / (data.win_count + 1)
                update_data["win_avg_round"] = data.win_avg_round
            }
            data.win_count = data.win_count + 1
            update_data["win_count"] = data.win_count
        }
        // total_count
        data.total_count = data.total_count + 1
        update_data["total_count"] = data.total_count
        // win_rate
        update_data["win_rate"] = data.win_count / data.total_count
        // total_round_count
        data.total_round_count = data.total_round_count + user2_data.round
        update_data["total_round_count"] = data.total_round_count
        // sum, max_3_darts, avg_3_dart
        let user2_max = data.max_3_darts
        let user2_max_change = false
        for(let i = 0; i < user2_data.scoreset.length; i++){
            data.sum = data.sum + user2_data.scoreset[i]
            if (user2_data.scoreset[i] > user2_max){
                user2_max = user2_data.scoreset[i]
                user2_max_change = true
            }
        }
        update_data["sum"] = data.sum
        update_data["avg_3_darts"] = data.sum / data.total_round_count
        if (user2_max_change){
            update_data["max_3_darts"] = user2_max
        }
        $.ajax({
            url: '/users/' + user2_mongo.userId,
            type: 'PATCH',
            data: JSON.stringify(update_data),
            dataType: "json",
            contentType: 'application/json; charset=utf-8',
            success: function(res) {
                console.log("Update user2 successfully")
            }
        })
    }).fail(function(status) {
        console.log("failed: " + status)
    })

    $.ajax({
        url: '/scores/' + user1_mongo.scoreId,
        type: 'PATCH',
        data: JSON.stringify({"scores": user1_data.scoreset_detail}),
        dataType: "json",
        contentType: 'application/json; charset=utf-8',
        success: function(res) {
            console.log("Update user1 scores successfully")
        }
    })

    $.ajax({
        url: '/scores/' + user2_mongo.scoreId,
        type: 'PATCH',
        data: JSON.stringify({"scores": user2_data.scoreset_detail}),
        dataType: "json",
        contentType: 'application/json; charset=utf-8',
        success: function(res) {
            console.log("Update user2 scores successfully")
        }
    })
}


// ---------------------------------------------------------
//                      Handle Submit
// ---------------------------------------------------------

$(".user1_input").keydown(function(event){
    if(event.keyCode==13){
       $(".user1_submit").click();
    }
})
$(".user2_input").keydown(function(event){
    if(event.keyCode==13){
       $(".user2_submit").click();
    }
})

function log(){
    console.log("============================================")
    console.log(user1_data)
    console.log(user2_data)
    console.log("temp_scoreset: " + temp_scoreset)
    console.log("temp_sum: " + temp_sum)
    console.log("round: " + round)
    console.log("count_this_round: " + count_this_round)
    console.log("count_this_user: " + count_this_user)
    console.log(user1_mongo)
    console.log(user2_mongo)
}

function updateVars(user_data, isBust, isWin){
    isBust ? user_data.temp_score = user_data.score : user_data.score = user_data.temp_score
    user_data.scoreset.push(temp_sum)
    user_data.scoreset_detail.push(temp_scoreset)
    user_data.round++
    if (!isWin){
        temp_scoreset = []
        temp_sum = 0
        count_this_user = 0
    }
}

function updateHTML(user, user_data, val, isBust){
    $("."+user+"_input").val("")
    $("."+user+"_score p").text(user_data.temp_score)
    $("."+user+"_sum").text(temp_sum)
    if (isBust){
        $("."+user+"_board ul").find("li").remove()
        for (let i = 1; i <= 3; i++){
            $("."+user+"_board ul").append("<li id='"+user+"_li_"+i+"'>0</li>") // Start from li_1
        }
        return
    }
    $("."+user+"_board ul").append("<li id='"+user+"_li_"+count_this_user+"'>"+val+"</li>") // Start from li_1
}

function updateHisBoard(user, user_data){
    $("."+user+"_his_round ul").append("<li>"+round+"</li>")
    $("."+user+"_his_score ul").append("<li>"+temp_sum+"</li>")
}

function scoreSubmit(user, user_data, val){
    if (count_this_round == 6){
        count_this_round = 0
        $(".round p").text(++round)
        $(".user1_board ul, .user2_board ul").find("li").remove()
        $(".user1_sum, .user2_sum").text(temp_sum)
    }
    count_this_round++
    count_this_user++
    user_data.temp_score -= val
    temp_sum += val
    temp_scoreset.push(val)
    if (user_data.temp_score < 0){
        temp_sum = 0
        temp_scoreset = [0,0,0]
        count_this_round += (3 - count_this_user)
        updateVars(user_data, true, false)
        updateHTML(user, user_data, val, true)
        updateHisBoard(user, user_data)
    }
    else if (user_data.temp_score == 0){
        updateVars(user_data, false, true)
        updateHTML(user, user_data, val, false)
        updateHisBoard(user, user_data)
        success(user)
    }
    else{
        updateHTML(user, user_data, val, false)
        if (count_this_user == 3){
            updateHisBoard(user, user_data)
            updateVars(user_data, false, false)
        }
    }
    log()
}

$(".user1_submit").click(function(){
    let val = $(".user1_input").val() == "" ? 0 : Number($(".user1_input").val())
    scoreSubmit("user1", user1_data, val)
})
$(".user2_submit").click(function(){
    let val = $(".user2_input").val() == "" ? 0 : Number($(".user2_input").val())
    scoreSubmit("user2", user2_data, val)
})

// ---------------------------------------------------------
//                    Handle Play Again
// ---------------------------------------------------------

$(".play_again").click(function(){
    location.reload(true);
})
