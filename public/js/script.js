var user1_data = {
    scores: [],
    tags: [],
    score: 301,
    temp_score: 301,
    round: 0
}
var user2_data = {
    scores: [],
    tags: [],
    score: 301,
    temp_score: 301,
    round: 0
}
var temp_scores = [] // scores of three darts in this round
var temp_tags = [] // scores of three tags in this round
var temp_sum = 0 // sum of three darts in this round
var round = 1
var count_this_round = 0 // 0 to 6
var count_this_user = 0 // 0 to 3
var user1_theme_color = "firebrick"
var user2_theme_color = "forestgreen"

// ---------------------------------------------------------
//                 Load Data & Render
// ---------------------------------------------------------

$(document).ready(function() {
    grabData(2,3)
})

function grabData(idx1, idx2){
    $.get("/users", function(data){
        for (let i in data[idx1]){
            user1_data[i] = data[idx1][i]
        }
        for (let i in data[idx2]){
            user2_data[i] = data[idx2][i]
        }
        
        $(".user1_board p, #user_name_1").text(user1_data.name)
        $(".user2_board p, #user_name_2").text(user2_data.name)

        $("#data_card_1 div span").eq(0).text((user1_data.win_rate * 100).toFixed(2) + "%")
        $("#data_card_1 div span").eq(1).text(user1_data.win_min_round)
        $("#data_card_1 div span").eq(2).text((user1_data.win_avg_round * 1).toFixed(2))
        $("#data_card_1 div span").eq(3).text(user1_data.max_3_darts)
        $("#data_card_1 div span").eq(4).text((user1_data.avg_3_darts * 1).toFixed(2))
        $("#data_card_1 div span").eq(5).text(user1_data.double)
        $("#data_card_1 div span").eq(6).text(user1_data.triple)
        $("#data_card_1 div span").eq(7).text(user1_data.missed)
        $("#data_card_1 div span").eq(8).text(user1_data.bust)
        $("#data_card_1 div span").eq(9).text(user1_data.bullseye)

        $("#data_card_2 div span").eq(0).text((user2_data.win_rate * 100).toFixed(2) + "%")
        $("#data_card_2 div span").eq(1).text(user2_data.win_min_round)
        $("#data_card_2 div span").eq(2).text((user2_data.win_avg_round * 1).toFixed(2))
        $("#data_card_2 div span").eq(3).text(user2_data.max_3_darts)
        $("#data_card_2 div span").eq(4).text((user2_data.avg_3_darts * 1).toFixed(2))
        $("#data_card_2 div span").eq(5).text(user2_data.double)
        $("#data_card_2 div span").eq(6).text(user2_data.triple)
        $("#data_card_2 div span").eq(7).text(user2_data.missed)
        $("#data_card_2 div span").eq(8).text(user2_data.bust)
        $("#data_card_2 div span").eq(9).text(user2_data.bullseye)

    }).fail(function(status) {
        console.log("failed: " + status)
    })

    $.get("/scores", function(data){
        user1_data.scoreId = data[idx1]._id
        user2_data.scoreId = data[idx2]._id
    }).fail(function(status) {
        console.log("failed: " + status)
    })
}

// ---------------------------------------------------------
//                      Handle Success
// ---------------------------------------------------------

function success(user){
    if (user == "user1"){
        updateUserMongo(user1_data, true)
        updateUserMongo(user2_data, false)
        $(".end").css("border", "4px solid "+user1_theme_color)
        $(".play_again").css("background-color", user1_theme_color)
        $("#winner").text(user1_data.name)
        $("#winner").css("color", user1_theme_color)
    }
    else{
        updateUserMongo(user1_data, false)
        updateUserMongo(user2_data, true)
        $(".end").css("border", "4px solid "+user2_theme_color)
        $(".play_again").css("background-color", user2_theme_color)
        $("#winner").text(user2_data.name)
        $("#winner").css("color", user2_theme_color)
    }
    $(".end").fadeIn(400)

    for(let i = 0; i < user1_data.scores.length; i++){
        updateScoreMongo(user1_data, i)
    }
    for(let i = 0; i < user2_data.scores.length; i++){
        updateScoreMongo(user2_data, i)
    }
}

function updateUserMongo(user_data, isWin){
    let update_data = {}
    if (isWin){
        if (user_data.win_min_round == null || round < user_data.win_min_round){
            update_data["win_min_round"] = round
        }
        if (user_data.win_avg_round == null){
            update_data["win_avg_round"] = round
        }
        else {
            update_data["win_avg_round"] = (user_data.win_avg_round * user_data.win_count + round) / (user_data.win_count + 1)
        }
        update_data["win_count"] = ++user_data.win_count // Increment first
    }
    update_data["total_count"] = ++user_data.total_count // Increment first
    update_data["win_rate"] = user_data.win_count / user_data.total_count
    update_data["total_round_count"] = user_data.total_round_count
    update_data["sum"] = user_data.sum
    update_data["avg_3_darts"] = user_data.avg_3_darts
    update_data["max_3_darts"] = user_data.max_3_darts
    update_data["single"] = user_data.single
    update_data["double"] = user_data.double
    update_data["triple"] = user_data.triple
    update_data["missed"] = user_data.missed
    update_data["bust"] = user_data.bust
    update_data["bullseye"] = user_data.bullseye

    $.ajax({
        url: '/users/' + user_data.userId,
        type: 'PATCH',
        data: JSON.stringify(update_data),
        dataType: "json",
        contentType: 'application/json; charset=utf-8',
        success: function(res) {
            console.log("Update user:"+user_data.userId+" successfully")
        }
    })
}

function updateScoreMongo(user_data, i){
    $.ajax({
        url: '/scores/' + user_data.scoreId,
        type: 'PATCH',
        data: JSON.stringify({
            "scores": {
                "score": user_data.scores[i],
                "tag": user_data.tags[i]
            }
        }),
        dataType: "json",
        contentType: 'application/json; charset=utf-8',
        success: function(res) {
            console.log("Update score:"+user_data.scoreId+" successfully")
        }
    })
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

$(".user1_submit").click(function(){
    if (round == 1){
        $(".user2_input").attr("disabled","disabled");
        $(".user2_submit").css("pointer-events", "none");
    }
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
    scoreSubmit("user1", "user2", user1_data, val, tag)
})
$(".user2_submit").click(function(){
    if (round == 1){
        $(".user1_input").attr("disabled","disabled");
        $(".user1_submit").css("pointer-events", "none");
    }
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
    scoreSubmit("user2", "user1", user2_data, val, tag)
})


function scoreSubmit(user, the_other_user, user_data, val, tag){
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
        lockInputAndSubmit(user, the_other_user)
        updateBoard(user, user_data, val, 99)
        updateHisCard(user, true)
        updateDataCard(user, user_data)
    }
    else if (user_data.temp_score == 0){
        temp_sum += val
        if (tag == 2 || tag == 3) {
            val /= tag
        }
        temp_scores.push(val)
        temp_tags.push(tag)
        updateUserData(user_data, false)
        updateBoard(user, user_data, val, tag)
        updateHisCard(user, false)
        updateDataCard(user, user_data)
        success(user)
    }
    else{
        temp_sum += val
        if (tag == 2 || tag == 3) {
            val /= tag
        }
        temp_scores.push(val)
        temp_tags.push(tag)
        updateBoard(user, user_data, val, tag)
        if (count_this_user == 3){
            lockInputAndSubmit(user, the_other_user)
            updateHisCard(user, false)
            updateUserData(user_data, false)
            updateDataCard(user, user_data)
            updateLocalVars()
        }
    }
    log()
}

function updateUserData(user_data, isBust){
    isBust ? user_data.temp_score = user_data.score : user_data.score = user_data.temp_score
    user_data.round++
    if (!isBust && temp_sum > user_data.max_3_darts) {
        user_data.max_3_darts = temp_sum
    }
    if (!isBust) {
        user_data.total_round_count++
        user_data.sum += temp_sum
        user_data.avg_3_darts = user_data.sum / user_data.total_round_count
    }
    for (let i in temp_scores){
        user_data.scores.push(temp_scores[i])
    }
    for (let i in temp_tags){
        user_data.tags.push(temp_tags[i])
        if (temp_tags[i] == 0){
            user_data.missed++
        }
        else if (temp_tags[i] == 1){
            user_data.single++
        }
        else if (temp_tags[i] == 2){
            user_data.double++
        }
        else if (temp_tags[i] == 3){
            user_data.triple++
        }
        else if (temp_tags[i] == 25 || temp_tags[i] == 50){
            user_data.bullseye++
        }
        else if (temp_tags[i] == 99){
            user_data.bust++
        }
    }
}

function updateLocalVars(){
    temp_scores = []
    temp_tags = []
    temp_sum = 0
    count_this_user = 0
}

function updateBoard(user, user_data, valOnBoard, tag){
    $("."+user+"_input").val("")
    $("."+user+"_score p").text(user_data.temp_score)
    $("."+user+"_sum").text(temp_sum)
    if (tag == 99){
        $("."+user+"_board ul").find("li").remove()
        for (let i = 1; i <= 3; i++){
            $("."+user+"_board ul").append("<li id='"+user+"_li_"+i+"'>-</li>") // Start from li_1
        }
    }
    else if (tag == 2){
        $("."+user+"_board ul").append("<li id='"+user+"_li_"+count_this_user+"'>D"+valOnBoard+"</li>") // Start from li_1
    }
    else if (tag == 3){
        $("."+user+"_board ul").append("<li id='"+user+"_li_"+count_this_user+"'>T"+valOnBoard+"</li>") // Start from li_1
    }
    else{
        $("."+user+"_board ul").append("<li id='"+user+"_li_"+count_this_user+"'>"+valOnBoard+"</li>") // Start from li_1
    }
}

function updateHisCard(user, isBust){
    $("."+user+"_his_round ul").append("<li>"+round+"</li>")
    if (isBust) {
        $("."+user+"_his_score ul").append("<li>-</li>")
        return
    }
    $("."+user+"_his_score ul").append("<li>"+temp_sum+"</li>")
}

function updateDataCard(user, user_data){
    let userNum
    user == "user1" ? userNum = 1 : userNum = 2
    $("#data_card_"+userNum+" div span").eq(3).text(user_data.max_3_darts)
    $("#data_card_"+userNum+" div span").eq(4).text((user_data.avg_3_darts * 1).toFixed(2))
    $("#data_card_"+userNum+" div span").eq(5).text(user_data.double)
    $("#data_card_"+userNum+" div span").eq(6).text(user_data.triple)
    $("#data_card_"+userNum+" div span").eq(7).text(user_data.missed)
    $("#data_card_"+userNum+" div span").eq(8).text(user_data.bust)
    $("#data_card_"+userNum+" div span").eq(9).text(user_data.bullseye)
    $("#data_card_"+userNum+" div span").eq(10).text(user_data.single)
}

function lockInputAndSubmit(userToLock, userToUnlock){
    $("."+userToLock+"_input").attr("disabled","disabled");
    $("."+userToLock+"_submit").css("pointer-events", "none");
    $("."+userToUnlock+"_input").removeAttr("disabled");
    $("."+userToUnlock+"_submit").css("pointer-events", "auto");
}

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
}

// ---------------------------------------------------------
//                    Handle Play Again
// ---------------------------------------------------------

$(".play_again").click(function(){
    location.reload(true);
})
