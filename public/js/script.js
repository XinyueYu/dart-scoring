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
var user1_id
var user2_id

$(document).ready(function() {
    $.get("/users", function(data){
        user1_id = data[0]._id
        user2_id = data[1]._id
    })
})

// ---------------------------------------------------------
//                      Handle Success
// ---------------------------------------------------------

function success(user){
    if (user == "user1"){
        $(".end").css("border", "4px solid #e63900")
        $(".play_again").css("background-color", "#e63900")
        $("#winner").text("Haozhi Yu")
        $("#winner").css("color", "#e63900")
    }
    else if (user == "user2"){
        $(".end").css("border", "4px solid #33cc33")
        $(".play_again").css("background-color", "#33cc33")
        $("#winner").text("Xinyue Yu")
        $("#winner").css("color", "#33cc33")
    }
    $(".mask").css("display", "block")
    $(".end").fadeIn(400)

    $.get("/users/" + user1_id, function(data){
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
            url: '/users/' + user1_id,
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

    $.get("/users/" + user2_id, function(data){
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
            url: '/users/' + user2_id,
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
    console.log("user1_id: " + user1_id)
    console.log("user2_id: " + user2_id)
}

function scoreSubmit(user, the_other_user, user_data, val){
    count_this_round++
    count_this_user++
    user_data.temp_score -= val
    temp_sum += val
    if (user_data.temp_score < 0){
        user_data.scoreset.push(0)
        user_data.scoreset_detail.push([0,0,0])
        temp_scoreset = []
        user_data.temp_score = user_data.score
        temp_sum = 0
        user_data.round++
        count_this_round += (3 - count_this_user)
        count_this_user = 0
        $("."+user+"_input").val("")
        $("."+user+"_score p").text(user_data.temp_score)
        $("."+user+"_sum").text(temp_sum)
        $("."+user+"_board ul").find("li").remove()
        for (let i = 1; i <= 3; i++){
            $("." + user + "_board ul").append("<li id='"+user+"_li_"+i+"'>"+0+"</li>") // Start from li_1
        }
        $("."+the_other_user+"_board ul").find("li").remove()
        $("."+the_other_user+"_sum").text(temp_sum)
        if (count_this_round == 6) {
            $(".round p").text(++round)
            count_this_round = 0
        }
    }
    else if (user_data.temp_score == 0){
        temp_scoreset.push(val)
        user_data.scoreset.push(temp_sum)
        user_data.scoreset_detail.push(temp_scoreset)
        user_data.score = user_data.temp_score
        user_data.round++
        $("."+user+"_input").val("")
        $("."+user+"_score p").text(user_data.temp_score)
        $("."+user+"_sum").text(temp_sum)
        $("."+user+"_board ul").append("<li id='"+user+"_li_"+count_this_user+"'>"+val+"</li>") // Start from li_1
        success(user)
    }
    else{
        temp_scoreset.push(val)
        $("."+user+"_input").val("")
        $("."+user+"_score p").text(user_data.temp_score)
        $("."+user+"_sum").text(temp_sum)
        $("."+user+"_board ul").append("<li id='"+user+"_li_"+count_this_user+"'>"+val+"</li>") // Start from li_1
        if (count_this_user == 3){
            user_data.scoreset.push(temp_sum)
            user_data.scoreset_detail.push(temp_scoreset)
            temp_scoreset = []
            user_data.score = user_data.temp_score
            temp_sum = 0
            user_data.round++
            count_this_user = 0
            $("."+the_other_user+"_board ul").find("li").remove()
            $("."+the_other_user+"_sum").text(temp_sum)
        }
        if (count_this_round == 6) {
            $(".round p").text(++round)
            count_this_round = 0
        }
    }
    log()
}

$(".user1_submit").click(function(){
    let val = $(".user1_input").val() == "" ? 0 : Number($(".user1_input").val())
    scoreSubmit("user1", "user2", user1_data, val)
})
$(".user2_submit").click(function(){
    let val = $(".user2_input").val() == "" ? 0 : Number($(".user2_input").val())
    scoreSubmit("user2", "user1", user2_data, val)
})

// ---------------------------------------------------------
//                    Handle Play Again
// ---------------------------------------------------------

$(".play_again").click(function(){
    user1_data = {
        scoreset_detail: [],
        scoreset: [],
        score: 301,
        temp_score: 301,
        round: 0,
    }
    user2_data = {
        scoreset_detail: [],
        scoreset: [],
        score: 301,
        temp_score: 301,
        round: 0,
    }
    temp_scoreset = []
    temp_sum = 0
    round = 1
    count_this_round = 0
    count_this_user = 0

    $(".mask, .end").css("display", "none")
    $(".user1_score p").text(user1_data.score)
    $(".user2_score p").text(user2_data.score)
    $(".user1_input, .user2_input").val("")
    $(".round p").text(round)
    $("ul").find("li").remove()
    $(".user1_sum, .user2_sum").text(temp_sum)

    log()
})
