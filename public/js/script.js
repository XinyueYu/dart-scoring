var user1_data = {
    scores: [],
    tags: [],
    scoreset: [], // Array of sum of three darts [23, 45, 15, 54, 42, ...]
    score: 301,
    temp_score: 301,
    round: 0,
    userId: null,
    scoreId: null,
    name: "",
    max: 0,
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
    userId: null,
    scoreId: null,
    name: "",
    max: 0,
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
var user1_theme_color = "firebrick"
var user2_theme_color = "forestgreen"

function grabData(idx1, idx2){
    $.get("/users", function(data){
        user1_data.userId = data[idx1]._id
        user2_data.userId = data[idx2]._id
        user1_data.name = data[idx1].name
        user2_data.name = data[idx2].name
        
        $(".user1_board p, #user_name_1").text(user1_data.name)
        $(".user2_board p, #user_name_2").text(user2_data.name)

        $("#data_card_1 div span").eq(0).text((data[idx1].win_rate * 100).toFixed(2) + "%")
        $("#data_card_1 div span").eq(1).text(data[idx1].win_min_round)
        $("#data_card_1 div span").eq(2).text((data[idx1].win_avg_round * 1).toFixed(2))
        $("#data_card_1 div span").eq(3).text(data[idx1].max_3_darts)
        $("#data_card_1 div span").eq(4).text((data[idx1].avg_3_darts * 1).toFixed(2))
        $("#data_card_1 div span").eq(5).text(data[idx1].double)
        $("#data_card_1 div span").eq(6).text(data[idx1].triple)
        $("#data_card_1 div span").eq(7).text(data[idx1].missed)
        $("#data_card_1 div span").eq(8).text(data[idx1].bust)
        $("#data_card_1 div span").eq(9).text(data[idx1].bullseye)
        $("#data_card_1 div span").eq(10).text(data[idx1].single)

        $("#data_card_2 div span").eq(0).text((data[idx2].win_rate * 100).toFixed(2) + "%")
        $("#data_card_2 div span").eq(1).text(data[idx2].win_min_round)
        $("#data_card_2 div span").eq(2).text((data[idx2].win_avg_round * 1).toFixed(2))
        $("#data_card_2 div span").eq(3).text(data[idx2].max_3_darts)
        $("#data_card_2 div span").eq(4).text((data[idx2].avg_3_darts * 1).toFixed(2))
        $("#data_card_2 div span").eq(5).text(data[idx2].double)
        $("#data_card_2 div span").eq(6).text(data[idx2].triple)
        $("#data_card_2 div span").eq(7).text(data[idx2].missed)
        $("#data_card_2 div span").eq(8).text(data[idx2].bust)
        $("#data_card_2 div span").eq(9).text(data[idx2].bullseye)
        $("#data_card_2 div span").eq(10).text(data[idx2].single)
    })
    $.get("/scores", function(data){
        user1_data.scoreId = data[idx1]._id
        user2_data.scoreId = data[idx2]._id
    })
}

$(document).ready(function() {
    grabData(2,3)
})

// ---------------------------------------------------------
//                      Handle Success
// ---------------------------------------------------------

function updateUserMongo(user_data, isWin){
    $.get("/users/" + user_data.userId, function(data){
        let update_data = {}
        if (isWin){
            if (data.win_min_round == null || round < data.win_min_round){
                update_data["win_min_round"] = round
            }
            if (data.win_avg_round == null){
                update_data["win_avg_round"] = round
            }
            else {
                update_data["win_avg_round"] = (data.win_avg_round * data.win_count + round) / (data.win_count + 1)
            }
            update_data["win_count"] = ++data.win_count
        }
        update_data["total_count"] = ++data.total_count
        update_data["win_rate"] = data.win_count / data.total_count
        update_data["total_round_count"] = data.total_round_count + user_data.round
        let max = data.max_3_darts
        let max_change = false
        for(let i = 0; i < user_data.scoreset.length; i++){
            data.sum += user_data.scoreset[i]
            if (user_data.scoreset[i] > max){
                max = user_data.scoreset[i]
                max_change = true
            }
        }
        update_data["sum"] = data.sum
        update_data["avg_3_darts"] = data.sum / (data.total_round_count + user_data.round)
        if (max_change){
            update_data["max_3_darts"] = max
        }
        update_data["single"] = data.single + user_data.single
        update_data["double"] = data.double + user_data.double
        update_data["triple"] = data.triple + user_data.triple
        update_data["missed"] = data.missed + user_data.missed
        update_data["bust"] = data.bust + user_data.bust
        update_data["bullseye"] = data.bullseye + user_data.bullseye

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
    }).fail(function(status) {
        console.log("failed: " + status)
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
}

function updateUserData(user_data, isBust){
    isBust ? user_data.temp_score = user_data.score : user_data.score = user_data.temp_score
    user_data.scoreset.push(temp_sum)
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
    user_data.round++
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

function lockInputAndSubmit(userToLock, userToUnlock){
    $("."+userToLock+"_input").attr("disabled","disabled");
    $("."+userToLock+"_submit").css("pointer-events", "none");
    $("."+userToUnlock+"_input").removeAttr("disabled");
    $("."+userToUnlock+"_submit").css("pointer-events", "auto");
}

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
            updateLocalVars()
        }
    }
    log()
}

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

// ---------------------------------------------------------
//                    Handle Play Again
// ---------------------------------------------------------

$(".play_again").click(function(){
    location.reload(true);
})
