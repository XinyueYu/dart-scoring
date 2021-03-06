var user1_data = {
    scores: [],
    tags: [],
    scores_in_3_darts: [],
    score: 301,
    temp_score: 301,
    round: 0,
}
var user2_data = {
    scores: [],
    tags: [],
    scores_in_3_darts: [],
    score: 301,
    temp_score: 301,
    round: 0,
}
var temp_scores = [] // scores of three darts in this round
var temp_tags = [] // scores of three tags in this round
var temp_sum = 0 // sum of three darts in this round
var round = 1
var count_this_round = 0 // 0 to 6
var count_this_user = 0 // 0 to 3
var user1IsPlaying = false
var success_count = 0
var user1_theme_color = "firebrick"
var user2_theme_color = "forestgreen"
var msgs = {
    wrong_button_msg: "Wrong button clicked.",
    invalid_input_msg: "Invalid number entered.",
    incomplete_round_msg: "Please enter 3 scores before switching player.",
    switch_player_msg: "Please switch player.",
    back_button_msg: "Game started! You should not leave this page.",
    ajax_user_error_msg: "An error occurs when updating user database!",
    ajax_score_error_msg: "An error occurs when creating new score!",
    wait: "Data upload is not finished yet."
}

// ---------------------------------------------------------
//                 Load Data & Render
// ---------------------------------------------------------

$(document).ready(function() {
    grabData(2,3)
    window.addEventListener('popstate', function () {
        history.pushState(null, null, document.URL)
        alert(msgs.back_button_msg)
    })
})

function grabData(idx1, idx2){
    $.get("/users", function(data){
        for (let i in data[idx1]){
            user1_data[i] = data[idx1][i]
        }
        for (let i in data[idx2]){
            user2_data[i] = data[idx2][i]
        }
        console.log(user1_data)
        console.log(user2_data)
        updateDataCard("user1", user1_data, true)
        updateDataCard("user2", user2_data, true)
        $(".user1_board p, #user_name_1").text(user1_data.name)
        $(".user2_board p, #user_name_2").text(user2_data.name)
    }).fail(function(status) {
        console.log("failed: " + status)
    })
}

// function toMap(user_data){
//     var result = user_data.spot_count.reduce(function(map, obj) {
//         map[obj._id] = obj.count;
//         return map;
//     }, {});
//     user_data.spot_count = result
// }
// function toMap(user_data){
//     let map = new Map()
//     user_data.spot_count.forEach(obj => map.set(obj._id, obj.count))
//     user_data.spot_count = map
// }

function updateDataCard(user, user_data, isStart){
    if (user_data.total_dart_count == 0 && user_data.total_round_count == 0 && user_data.total_game_count == 0) return
    let num = (user == "user1") ? 1 : 2
    if (isStart){
        $("#data_card_"+num+" ul li span").eq(0).text((user_data.win_rate * 100).toFixed(2) + "%")
        if (user_data.win_rate != 0) {
            $("#data_card_"+num+" ul li span").eq(1).text(user_data.win_min_round)
            $("#data_card_"+num+" ul li span").eq(2).text((user_data.win_avg_round * 1).toFixed(2))
        }
        $("#data_card_"+num+" ul li span").eq(3).text(user_data.spots.toString().replace(/,/g, ', '))
    }
    $("#data_card_"+num+" ul li span").eq(4).text(user_data.max_3_darts)
    $("#data_card_"+num+" ul li span").eq(5).text((user_data.avg_3_darts * 1).toFixed(2))
    $("#data_card_"+num+" ul li span").eq(6).text((user_data.double / user_data.total_dart_count * 100).toFixed(2) + "%")
    $("#data_card_"+num+" ul li span").eq(7).text((user_data.triple / user_data.total_dart_count * 100).toFixed(2) + "%")
    $("#data_card_"+num+" ul li span").eq(8).text((user_data.missed / user_data.total_dart_count * 100).toFixed(2) + "%")
    $("#data_card_"+num+" ul li span").eq(9).text((user_data.bullseye / user_data.total_dart_count * 100).toFixed(2) + "%")
}

// ---------------------------------------------------------
//                      Handle Success
// ---------------------------------------------------------

function success(user){
    if (user == "user1"){
        updateUserMongo(user1_data, true) // isWin
        updateUserMongo(user2_data, false) // isWin
        updateScoreMongo(user1_data, user2_data, true) // isWin
        updateScoreMongo(user2_data, user1_data, false) // isWin
        $(".end").css("border", "4px solid "+user1_theme_color)
        $(".play_again").css("background-color", user1_theme_color)
        $("#winner").text(user1_data.name)
        $("#winner").css("color", user1_theme_color)
    }
    else{
        updateUserMongo(user1_data, false) // isWin
        updateUserMongo(user2_data, true) // isWin
        updateScoreMongo(user1_data, user2_data, false) // isWin
        updateScoreMongo(user2_data, user1_data, true) //isWin
        $(".end").css("border", "4px solid "+user2_theme_color)
        $(".play_again").css("background-color", user2_theme_color)
        $("#winner").text(user2_data.name)
        $("#winner").css("color", user2_theme_color)
    }
    $(".end").fadeIn(400)
    $(".board, .wrapper").css("pointer-events","none")
    $(".round").css("-webkit-animation-name","none")
}

// ---------------------------------------------------------
//                 Update Data in Mongo
// ---------------------------------------------------------

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
    update_data["total_game_count"] = ++user_data.total_game_count // Increment first
    update_data["win_rate"] = user_data.win_count / user_data.total_game_count
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
    update_data["total_dart_count"] = user_data.total_dart_count

    $.ajax({
        url: '/users/' + user_data._id,
        type: 'PATCH',
        data: JSON.stringify(update_data),
        dataType: "json",
        contentType: 'application/json; charset=utf-8',
        success: function(res) {
            success_count++
            console.log("Update user "+user_data.name+" successfully")
        },
        error: function(res){
            alert(msgs.ajax_user_error_msg)
        }
    })
}

function updateScoreMongo(user_data, rival_user_data, isWin){
    let update_data = {}
    update_data["userId"] = user_data._id
    update_data["rival_userId"] = rival_user_data._id
    update_data["game"] = user_data.total_game_count
    update_data["total_score"] = 301 - user_data.temp_score
    update_data["scores_in_3_darts"] = user_data.scores_in_3_darts
    update_data["scores"] = user_data.scores
    update_data["tags"] = user_data.tags
    update_data["isWin"] = isWin

    $.ajax({
        url: '/scores',
        type: 'POST',
        data: JSON.stringify(update_data),
        dataType: "json",
        contentType: 'application/json; charset=utf-8',
        success: function(res) {
            success_count++
            console.log("Create new game record for "+user_data.name+" successfully")
        },
        error: function(res){
            alert(msgs.ajax_score_error_msg)
        }
    })
}

// ---------------------------------------------------------
//                      Handle Input
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
$(".user1_input").focus(function(){
    if (count_this_user != 0 && !user1IsPlaying) {
        $(this).blur()
        $(".user2_input").focus()
        alert(msgs.incomplete_round_msg)
    }
    else if (count_this_user == 0 && !user1IsPlaying && user1_data.round != 0) {
        $(this).blur()
        $(".user2_input").focus()
        alert(msgs.switch_player_msg)
    }
    $(this).val("")
})
$(".user2_input").focus(function(){
    if (count_this_user != 0 && user1IsPlaying) {
        $(this).blur()
        $(".user1_input").focus()
        alert(msgs.incomplete_round_msg)
    }
    else if (count_this_user == 0 && user1IsPlaying && user2_data.round != 0) {
        $(this).blur()
        $(".user1_input").focus()
        alert(msgs.switch_player_msg)
    }
    $(this).val("")
})

// ---------------------------------------------------------
//                      Handle Sumbit
// ---------------------------------------------------------

$(".user1_submit").click(function(){
    let val = ($(".user1_input").val() == "") ? 0 : Number($(".user1_input").val())
    if (checkVal(val)) return alert(msgs.invalid_input_msg)
    let tag = 1
    if ($(this).attr("id") == "user1_submit_2"){
        if (checkProduct(val)) return alert(msgs.wrong_button_msg)
        tag = 2
        val *= 2
    }
    else if($(this).attr("id") == "user1_submit_3"){
        if (checkProduct(val)) return alert(msgs.wrong_button_msg)
        tag = 3
        val *= 3
    }
    else if (val == 0 || val == 25 || val == 50){
        tag = val
    }
    if (round == 1){
        user1IsPlaying = true
        $(".user2_submit").css("pointer-events", "none");
    }
    scoreSubmit("user1", "user2", user1_data, val, tag)
})
$(".user2_submit").click(function(){
    let val = ($(".user2_input").val() == "") ? 0 : Number($(".user2_input").val())
    if (checkVal(val)) return alert(msgs.invalid_input_msg)
    let tag = 1
    if ($(this).attr("id") == "user2_submit_2"){
        if (checkProduct(val)) return alert(msgs.wrong_button_msg)
        tag = 2
        val *= 2
    }
    else if($(this).attr("id") == "user2_submit_3"){
        if (checkProduct(val)) return alert(msgs.wrong_button_msg)
        tag = 3
        val *= 3
    }
    else if (val == 0 || val == 25 || val == 50){
        tag = val
    }
    if (round == 1){
        user1IsPlaying = false
        $(".user1_submit").css("pointer-events", "none");
    }
    scoreSubmit("user2", "user1", user2_data, val, tag)
})

function checkVal(val){
    return (!Number.isInteger(val)) || val < 0 || (val > 20 && val != 25 && val != 50 )
}

function checkProduct(val){
    return val == 0 || val == 25 || val == 50
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
        updateUserData(user_data, true) // boolean: isBust
        resetLocalVars()
        lockInputAndSubmit(user, the_other_user)
        updateBoard(user, user_data, val, 99)
        updateHisCard(user, true) // boolean: isBust
        updateDataCard(user, user_data, false) // boolean: isStart
    }
    else if (user_data.temp_score == 0){
        temp_sum += val
        if (tag == 2 || tag == 3) {
            val /= tag
        }
        temp_scores.push(val)
        temp_tags.push(tag)
        updateUserData(user_data, false) // boolean: isBust
        updateBoard(user, user_data, val, tag)
        updateHisCard(user, false) // boolean: isBust
        updateDataCard(user, user_data, false) // boolean: isStart
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
            updateHisCard(user, false) // boolean: isBust
            updateUserData(user_data, false) // boolean: isBust
            updateDataCard(user, user_data, false) // boolean: isStart
            resetLocalVars()
            lockInputAndSubmit(user, the_other_user)
        }
        else{
            $("."+user+"_input").focus()
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
        user_data.total_dart_count += temp_scores.length
        user_data.total_round_count++
        user_data.sum += temp_sum
        user_data.avg_3_darts = user_data.sum / user_data.total_round_count
    }
    user_data.scores.push(temp_scores)
    user_data.tags.push(temp_tags)
    user_data.scores_in_3_darts.push(temp_sum)
    for (let i in temp_tags){
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
    // if (!isBust) {
    //     for (let i in temp_scores){
    //         user_data.spot_count[temp_scores[i]] = (user_data.spot_count[temp_scores[i]] == undefined) ? 1 : user_data.spot_count[temp_scores[i]]+1
    //     }
    //     let arr_for_sort = []
    //     for (let i in user_data.spots){
    //         arr_for_sort.push({
    //             key: user_data.spots[i],
    //             value: user_data.spot_count[user_data.spots[i]]
    //         })
    //     }
    //     for (let i in temp_scores){
    //         arr_for_sort.push({
    //             key: user_data.temp_scores[i],
    //             value: user_data.spot_count[user_data.temp_scores[i]]
    //         })
    //     }
    //     arr_for_sort.sort((a,b) => b.value - a.value)
    //     user_data.spots = arr_for_sort
    // }
}

// Not Using
function fetchHighestThree(user_data){
    if (user_data.spot_count.length != 0) {
        user_data.spot_count.sort((a,b) => (b.count - a.count))
        let arr = []
        for (let i = 0; i < 3 && i < user_data.spot_count.length; i++){
            arr.push(user_data.spot_count[i]._id)
        }
        return arr
    }
}

function resetLocalVars(){
    temp_scores = []
    temp_tags = []
    temp_sum = 0
    count_this_user = 0
    user1IsPlaying = !user1IsPlaying
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
    $("."+userToLock+"_input").blur()
    $("."+userToLock+"_submit").css("pointer-events", "none")
    $("."+userToUnlock+"_input").focus()
    $("."+userToUnlock+"_submit").css("pointer-events", "auto")
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
    if (success_count == 4) location.reload(true)
    else alert(msgs.wait)
})

$(".end").bind("mousedown", function(event){
    let ori_top = $(this).offset().top
    let ori_left = $(this).offset().left
    $(this).css({
        top: ori_top,
        left: ori_left,
        margin: 0
    })
    let mouse_ori_x = event.pageX
    let mouse_ori_y = event.pageY
    $(document).bind("mousemove",function(ev){
        let mouse_move_x = ev.pageX - mouse_ori_x
        let mouse_move_y = ev.pageY - mouse_ori_y
        let new_top = ori_top + mouse_move_y + "px"
        let new_left = ori_left + mouse_move_x + "px"
        $(".end").css({
            top: new_top,
            left: new_left
        })
    })
    $(document).bind("mouseup",function(){
        $(this).unbind("mousemove")
    })
})
