var user1_data = {
    scores: [],
    tags: [],
    scoreset: [], // Array of sum of three darts [23, 45, 15, 54, 42, ...]
    score: 301,
    temp_score: 301,
    round: 0,
    single: 0,
    double: 0,
    triple: 0,
    missed: 0,
    bust: 0,
    bullseye: 0
}
var user2_data = {
    scores: [],
    tags: [],
    scoreset: [],
    score: 301,
    temp_score: 301,
    round: 0,
    single: 0,
    double: 0,
    triple: 0,
    missed: 0,
    bust: 0,
    bullseye: 0
}
var temp_scores = [] // scores of three darts in this round
var temp_tags = [] // scores of three tags in this round
var temp_sum = 0 // sum of three darts in this round
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
        $("#data_card_1 div span").eq(5).text(data[idx1].single)
        $("#data_card_1 div span").eq(6).text(data[idx1].double)
        $("#data_card_1 div span").eq(7).text(data[idx1].triple)
        $("#data_card_1 div span").eq(8).text(data[idx1].missed)
        $("#data_card_1 div span").eq(9).text(data[idx1].bust)
        $("#data_card_1 div span").eq(10).text(data[idx1].bullseye)

        $("#data_card_2 div span").eq(0).text((data[idx2].win_rate * 100).toFixed(2) + "%")
        $("#data_card_2 div span").eq(1).text(data[idx2].win_min_round)
        $("#data_card_2 div span").eq(2).text((data[idx2].win_avg_round * 1).toFixed(2))
        $("#data_card_2 div span").eq(3).text(data[idx2].max_3_darts)
        $("#data_card_2 div span").eq(4).text((data[idx2].avg_3_darts * 1).toFixed(2))
        $("#data_card_2 div span").eq(5).text(data[idx2].single)
        $("#data_card_2 div span").eq(6).text(data[idx2].double)
        $("#data_card_2 div span").eq(7).text(data[idx2].triple)
        $("#data_card_2 div span").eq(8).text(data[idx2].missed)
        $("#data_card_2 div span").eq(9).text(data[idx2].bust)
        $("#data_card_2 div span").eq(10).text(data[idx2].bullseye)
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

    for (let i = 0; i < user1_data.tags.length; i++){
        if (user1_data.tags[i] == 0){
            user1_data.missed++
        }
        else if (user1_data.tags[i] == 1){
            user1_data.single++
        }
        else if (user1_data.tags[i] == 2){
            user1_data.double++
        }
        else if (user1_data.tags[i] == 3){
            user1_data.triple++
        }
        else if (user1_data.tags[i] == 25 || user1_data.tags[i] == 50){
            user1_data.bullseye++
        }
        else if (user1_data.tags[i] == 99){
            user1_data.bust++
        }
    }

    $.get("/users/" + user1_mongo.userId, function(data){
        let update_data = {}
        // win_count, win_min_round, win_avg_round
        if (user == "user1"){
            if (data.win_min_round == null || round < data.win_min_round){
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
        update_data["single"] = data.single + user1_data.single
        update_data["double"] = data.double + user1_data.double
        update_data["triple"] = data.triple + user1_data.triple
        update_data["missed"] = data.missed + user1_data.missed
        update_data["bust"] = data.bust + user1_data.bust
        update_data["bullseye"] = data.bullseye + user1_data.bullseye

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

    for (let i = 0; i < user2_data.tags.length; i++){
        if (user2_data.tags[i] == 0){
            user2_data.missed++
        }
        else if (user2_data.tags[i] == 1){
            user2_data.single++
        }
        else if (user2_data.tags[i] == 2){
            user2_data.double++
        }
        else if (user2_data.tags[i] == 3){
            user2_data.triple++
        }
        else if (user2_data.tags[i] == 25 || user2_data.tags[i] == 50){
            user2_data.bullseye++
        }
        else if (user2_data.tags[i] == 99){
            user2_data.bust++
        }
    }



    $.get("/users/" + user2_mongo.userId, function(data){
        let update_data = {}
        // win_count, win_min_round, win_avg_round
        if (user == "user2"){
            if (data.win_min_round == null || round < data.win_min_round){
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
        update_data["single"] = data.single + user2_data.single
        update_data["double"] = data.double + user2_data.double
        update_data["triple"] = data.triple + user2_data.triple
        update_data["missed"] = data.missed + user2_data.missed
        update_data["bust"] = data.bust + user2_data.bust
        update_data["bullseye"] = data.bullseye + user2_data.bullseye

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

    for(let i = 0; i < user1_data.scores.length; i++){
        $.ajax({
            url: '/scores/' + user1_mongo.scoreId,
            type: 'PATCH',
            data: JSON.stringify({
                "scores": {
                    "score": user1_data.scores[i],
                    "tag": user1_data.tags[i]
                }
            }),
            dataType: "json",
            contentType: 'application/json; charset=utf-8',
            success: function(res) {
                console.log("Update user1 scores successfully")
            }
        })
    }
    for(let i = 0; i < user2_data.scores.length; i++){
        $.ajax({
            url: '/scores/' + user2_mongo.scoreId,
            type: 'PATCH',
            data: JSON.stringify({
                "scores": {
                    "score": user2_data.scores[i],
                    "tag": user2_data.tags[i]
                }
            }),
            dataType: "json",
            contentType: 'application/json; charset=utf-8',
            success: function(res) {
                console.log("Update user2 scores successfully")
            }
        })
    }
}


// ---------------------------------------------------------
//                      Handle Submit
// ---------------------------------------------------------

$(".user1_input").keydown(function(event){
    if(event.keyCode==13){
       $(".user1_submit").eq(0).click();
    }
})
$(".user2_input").keydown(function(event){
    if(event.keyCode==13){
       $(".user2_submit").eq(0).click();
    }
})

function log(){
    console.log("============================================")
    console.log(user1_data)
    console.log(user2_data)
    console.log("temp_scores: " + temp_scores)
    console.log("temp_tags: " + temp_tags)
    console.log("temp_sum: " + temp_sum)
    console.log("round: " + round)
    console.log("count_this_round: " + count_this_round)
    console.log("count_this_user: " + count_this_user)
    console.log(user1_mongo)
    console.log(user2_mongo)
}

function updateUserData(user_data, isBust){
    isBust ? user_data.temp_score = user_data.score : user_data.score = user_data.temp_score
    user_data.scoreset.push(temp_sum)
    for (let i in temp_scores){
        user_data.scores.push(temp_scores[i])
    }
    for (let i in temp_tags){
        user_data.tags.push(temp_tags[i])
    }
    user_data.round++
}

function updateLocalVars(){
    temp_scores = []
    temp_tags = []
    temp_sum = 0
    count_this_user = 0
}

function updateBoard(user, user_data, val, isBust){
    $("."+user+"_input").val("")
    $("."+user+"_score p").text(user_data.temp_score)
    $("."+user+"_sum").text(temp_sum)
    if (isBust){
        $("."+user+"_board ul").find("li").remove()
        for (let i = 1; i <= 3; i++){
            $("."+user+"_board ul").append("<li id='"+user+"_li_"+i+"'>-</li>") // Start from li_1
        }
        return
    }
    $("."+user+"_board ul").append("<li id='"+user+"_li_"+count_this_user+"'>"+val+"</li>") // Start from li_1
}

function updateHisCard(user, isBust){
    $("."+user+"_his_round ul").append("<li>"+round+"</li>")
    if (isBust) {
        $("."+user+"_his_score ul").append("<li>-</li>")
        return
    }
    $("."+user+"_his_score ul").append("<li>"+temp_sum+"</li>")
}

function scoreSubmit(user, user_data, val, tag){
    if (count_this_round == 6){
        count_this_round = 0
        $(".round p").text(++round)
        $(".user1_board ul, .user2_board ul").find("li").remove()
        $(".user1_sum, .user2_sum").text(temp_sum)
    }
    count_this_round++
    count_this_user++
    user_data.temp_score -= val
    if (user_data.temp_score < 0){
        temp_sum = 0
        temp_scores = [0]
        temp_tags = [99]
        count_this_round += (3 - count_this_user)
        updateUserData(user_data, true)
        updateLocalVars()
        updateBoard(user, user_data, val, true)
        updateHisCard(user, true)
    }
    else if (user_data.temp_score == 0){
        temp_sum += val
        tag == 2 || tag == 3 ? temp_scores.push(val/tag) : temp_scores.push(val)
        temp_tags.push(tag)
        updateUserData(user_data, false)
        updateBoard(user, user_data, val, false)
        updateHisCard(user, false)
        success(user)
    }
    else{
        temp_sum += val
        tag == 2 || tag == 3 ? temp_scores.push(val/tag) : temp_scores.push(val)
        temp_tags.push(tag)
        updateBoard(user, user_data, val, false)
        if (count_this_user == 3){
            updateHisCard(user, false)
            updateUserData(user_data, false)
            updateLocalVars()
        }
    }
    log()
}

$(".user1_submit").click(function(){
    let tag = 1
    let val = $(".user1_input").val() == "" ? 0 : Number($(".user1_input").val())
    if($(this).attr("id") == "user1_submit_2"){
        val *= 2
        tag = 2
    }
    else if($(this).attr("id") == "user1_submit_3"){
        val *= 3
        tag = 3
    }
    else if (val == 0 || val == 25 || val == 50){
        tag = val
    }
    scoreSubmit("user1", user1_data, val, tag)
})
$(".user2_submit").click(function(){
    let tag = 1
    let val = $(".user2_input").val() == "" ? 0 : Number($(".user2_input").val())
    if($(this).attr("id") == "user2_submit_2"){
        val *= 2
        tag = 2
    }
    else if($(this).attr("id") == "user2_submit_3"){
        val *= 3
        tag = 3
    }
    else if (val == 0 || val == 25 || val == 50){
        tag = val
    }
    scoreSubmit("user2", user2_data, val, tag)
})

// ---------------------------------------------------------
//                    Handle Play Again
// ---------------------------------------------------------

$(".play_again").click(function(){
    location.reload(true);
})
