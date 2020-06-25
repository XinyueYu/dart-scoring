var user1_scoreset = []
var user2_scoreset = []
// var user1_temp_scoreset = []
// var user2_temp_scoreset = []
var user1_score = 301
var user2_score = 301
// var user1_temp_score = 301
// var user2_temp_score = 301
var curscore = 0
var round = 1
var user1_round = 0
var user2_round = 0
// var user1_temp_count = 0 // Number of dart in this round
// var user2_temp_count = 0 // Number of dart in this round
var wait = true
var can_cancel_user1 = false
var can_cancel_user2 = false
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
        var update_data = {}
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
        data.total_round_count = data.total_round_count + user1_round
        update_data["total_round_count"] = data.total_round_count
        // sum, max_3_darts, avg_3_dart
        let user1_max = data.max_3_darts
        let user1_max_change = false
        for(var i = 0; i < user1_scoreset.length; i++){
            data.sum = data.sum + user1_scoreset[i]
            if (user1_scoreset[i] > user1_max){
                user1_max = user1_scoreset[i]
                user1_max_change = true
                console.log("Find a larger max for user 1")
            }
        }
        update_data["sum"] = data.sum
        update_data["avg_3_darts"] = data.sum / data.total_round_count
        if (user1_max_change){
            update_data["max_3_darts"] = user1_max
        }
        console.log("update_data: " + update_data)
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
        var update_data = {}
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
        data.total_round_count = data.total_round_count + user2_round
        update_data["total_round_count"] = data.total_round_count
        // sum, max_3_darts, avg_3_dart
        let user2_max = data.max_3_darts
        let user2_max_change = false
        for(var i = 0; i < user2_scoreset.length; i++){
            data.sum = data.sum + user2_scoreset[i]
            if (user2_scoreset[i] > user2_max){
                user2_max = user2_scoreset[i]
                user2_max_change = true
                console.log("Find a larger max for user 2")
            }
        }
        update_data["sum"] = data.sum
        update_data["avg_3_darts"] = data.sum / data.total_round_count
        if (user2_max_change){
            update_data["max_3_darts"] = user2_max
        }
        console.log("update_data: " + update_data)
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

$(".user1_submit").click(function(){
    if (!can_cancel_user1){
        can_cancel_user1 = true
    }
    if (user1_score - $(".user1_input").val() >= 0 && $(".user1_input").val() != ""){
        curscore = $(".user1_input").val()
        user1_score -= curscore
    }
    else{
        curscore = 0
    }
    user1_round++
    user1_scoreset.push(Number(curscore))
    // if (user1_temp_count == 2){
    //     let sum = 0
    //     for (let i = 0; i < 2; i++){
    //         sum += user1_temp_scoreset[i] // Consider using Number() here
    //     }
    //     if (user1_score - sum >= 0){
    //         user1_score = user1_temp_score
    //     }
    //     user1_round++
    //     user1_temp_count = 0
    // }
    // $(".user1_board ul li").eq(user1_temp_count - 1).text(curscore)
    $(".user1_board ul").append("<li id='user1_li_"+user1_round+"'>"+curscore+"</li>") // Start from li_1
    $(".user1_score p").text(user1_score)
    $(".user1_input").val("")
    $(".user1_minus").text("-"+curscore)
    $(".user1_minus").show()
    $(".user1_minus").animate({top:'-120px', opacity:'0.5'},600,function(){
        $(".user1_minus").hide()
        $(".user1_minus").css("top","-60px")
        $(".user1_minus").css("opacity","1")
    });
    if (user1_score == 0){
        success("user1")
    }
    else{
        if (!wait) {
            $(".round p").text(++round)
        }
        wait = !wait
    }
})

$(".user2_submit").click(function(){
    if (!can_cancel_user2){
        can_cancel_user2 = true
    }
    if (user2_score - $(".user2_input").val() >= 0 && $(".user2_input").val() != ""){
        curscore = $(".user2_input").val()
        user2_score -= curscore
    }
    else{
        curscore = 0
    }
    user2_round++
    user2_scoreset.push(Number(curscore))
    $(".user2_board ul").append("<li id='user2_li_"+user2_round+"'>"+curscore+"</li>") // Start from li_1
    $(".user2_score p").text(user2_score)
    $(".user2_input").val("")
    $(".user2_minus").text("-"+curscore)
    $(".user2_minus").show()
    $(".user2_minus").animate({top:'-120px', opacity:'0.5'},600,function(){
        $(".user2_minus").hide()
        $(".user2_minus").css("top","-60px")
        $(".user2_minus").css("opacity","1")
    });
    if (user2_score == 0){
        success("user2")
    }
    else{
        if (!wait) {
            $(".round p").text(++round)
        }
        wait = !wait
    }
})

// ---------------------------------------------------------
//                      Handle Cancel
// ---------------------------------------------------------

function cancelCheck(){
    if (user1_scoreset.length > 0 || user2_scoreset.length > 0){
        if (wait) {
            $(".round p").text(--round)
        }
        wait = !wait
    }
    else{
        can_cancel_user1 = false
        can_cancel_user2 = false
        wait = true
    }
}

$(".user1_cancel").on("click", function(){
    if (can_cancel_user1){
        let cancel_score = user1_scoreset.pop()
        user1_score += Number(cancel_score)
        $(".user1_score p").text(user1_score)
        $("#user1_li_"+(user1_round)).remove()
        user1_round--
        can_cancel_user1 = false
        can_cancel_user2 = true
        cancelCheck()
    }
})
$(".user2_cancel").on("click", function(){
    if (can_cancel_user2){
        let cancel_score = user2_scoreset.pop()
        user2_score += Number(cancel_score)
        $(".user2_score p").text(user2_score)
        $("#user2_li_"+(user2_round)).remove()
        user2_round--
        can_cancel_user2 = false
        can_cancel_user1 = true
        cancelCheck()
    }
})

$(".user1_cancel").hover(function(){
    if (can_cancel_user1){
        $(this).css("cursor", "pointer")
    }
    else{
        $(this).css("cursor", "default")
    }
})
$(".user2_cancel").hover(function(){
    if (can_cancel_user2){
        $(this).css("cursor", "pointer")
    }
    else{
        $(this).css("cursor", "default")
    }
})

// ---------------------------------------------------------
//                    Handle Play Again
// ---------------------------------------------------------

$(".play_again").click(function(){
    user1_score = 301
    user2_score = 301
    user1_scoreset = []
    user2_scoreset = []
    // user1_temp_scoreset = []
    // user2_temp_scoreset = []
    curscore = 0
    round = 1
    user1_round = 0
    user2_round = 0
    // user1_temp_count = 0
    // user2_temp_count = 0
    wait = true
    can_cancel_user1 = false
    can_cancel_user2 = false
    user1_id = null
    user2_id = null

    $(".mask").css("display", "none")
    $(".end").css("display", "none")
    $(".user1_score p").text(user1_score)
    $(".user2_score p").text(user2_score)
    $(".user1_minus").text("-0")
    $(".user2_minus").text("-0")
    $(".user1_input").val("")
    $(".user2_input").val("")
    $(".round p").text("1")
    $("ul").find("li").remove()
})
