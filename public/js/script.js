var user1 = {
    username: "Haozhi",
    max: 0,
    avg: 0,
};

var user2 = {
    username: "Xinyue",
    max: 0,
    avg: 0,
};

var user1_scoreset = []
var user2_scoreset = []
// var user1_temp = []
// var user2_temp = []
var user1_score = 301
var user2_score = 301
// var user1_accum = 0
// var user2_accum = 0
// var user1_count = 0
// var user2_count = 0
var round = 1
var user1_round = 0
var user2_round = 0
var wait = true
var can_cancel_user1 = false
var can_cancel_user2 = false

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
    var curscore = $(".user1_input").val()
    temp_score = user1_score - curscore
    if (temp_score >= 0 && $(".user1_input").val() != ""){
        user1_score = temp_score
        // user1_accum = user1_accum + Number(curscore)
        $(".user1_minus").text("-"+curscore)
        $(".user1_board ul").append("<li id=user1_li_"+user1_round+">"+curscore+"<\li>")
    }
    else{
        $(".user1_minus").text("-0")
        $(".user1_board ul").append("<li id=user1_li_"+user1_round+">0<\li>")
    }
    user1_round++
    user1_scoreset.push(curscore)
    $(".user1_score p").text(user1_score)
    $(".user1_input").val("")
    $(".user1_minus").show();
    $(".user1_minus").animate({top:'-120px', opacity:'0.5'},600,function(){
        $(".user1_minus").hide();
        $(".user1_minus").css("top","-60px")
        $(".user1_minus").css("opacity","1")
    });
    if (user1_score == 0){
        $(".end").css("border", "4px solid #e63900")
        $(".play_again").css("background-color", "#e63900")
        $("#winner").text("Haozhi Yu")
        $("#winner").css("color", "#e63900")
        $(".mask").css("display", "block")
        $(".end").fadeIn(400)
    }
    else{
        if (!wait) {
            round++
            $(".round p").text(round)
        }
        wait = !wait
    }
})

$(".user2_submit").click(function(){
    if (!can_cancel_user2){
        can_cancel_user2 = true
    }
    var curscore = $(".user2_input").val()
    temp_score = user2_score - curscore
    if (temp_score >= 0 && $(".user2_input").val() != ""){
        user2_score = temp_score
        // user2_accum = user2_accum + Number(curscore)
        $(".user2_minus").text("-"+curscore)
        $(".user2_board ul").append("<li id=user2_li_"+user2_round+">"+curscore+"<\li>")
    }
    else{
        $(".user2_minus").text("-0")
        $(".user2_board ul").append("<li id=user1_li_"+user2_round+">0<\li>")
    }
    user2_round++
    user2_scoreset.push(curscore)
    $(".user2_score p").text(user2_score)
    $(".user2_input").val("")
    $(".user2_minus").show();
    $(".user2_minus").animate({top:'-120px', opacity:'0.5'},600,function(){
        $(".user2_minus").hide();
        $(".user2_minus").css("top","-60px")
        $(".user2_minus").css("opacity","1")
    });
    if (user2_score == 0){
        $(".end").css("border", "4px solid #33cc33")
        $(".play_again").css("background-color", "#33cc33")
        $("#winner").text("Xinyue Yu")
        $("#winner").css("color", "#33cc33")
        $(".mask").css("display", "block")
        $(".end").fadeIn(400)
    }
    else{
        if (!wait) {
            round++
            $(".round p").text(round)
        }
        wait = !wait
    }
})

$(".user1_cancel").on("click", function(){
    if (can_cancel_user1){
        var cancel_score = user1_scoreset.pop()
        user1_score += Number(cancel_score)
        $(".user1_score p").text(user1_score)
        // $(this).parent(".input_wrap").parent(".left").parent(".wrapper").siblings(".board").children(".board_wrap").children(".user1_board").children("ul").children("li").eq(0).remove()
        $("#user1_li_"+(user1_round-1)).remove()
        user1_round--
        can_cancel_user1 = !can_cancel_user1
        if (wait) {
            round--
            $(".round p").text(round)
        }
        wait = !wait
    }
})
$(".user2_cancel").on("click", function(){
    if (can_cancel_user2){
        var cancel_score = user2_scoreset.pop()
        user2_score += Number(cancel_score)
        $(".user2_score p").text(user2_score)
        $("#user2_li_"+(user2_round-1)).remove()
        user2_round--
        can_cancel_user2 = !can_cancel_user2
        if (wait) {
            round--
            $(".round p").text(round)
        }
        wait = !wait
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
// wait=T user1submit wait=F user2submit count++ wait=T

$(".play_again").click(function(){
    user1_score = 301
    user2_score = 301
    // user1_accum = 0
    // user2_accum = 0
    user1_scoreset = []
    user2_scoreset = []
    round = 1
    user1_round = 0
    user2_round = 0
    wait = true
    curscore = 0
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
