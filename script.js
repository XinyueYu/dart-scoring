var user1 = {
    "user1":{
        "name": "Haozhi",
        "win_count": 0,
        "total_count": 0,
        "win_min_round": 0,
        "max": 0,
        "avg": 0,
        "triple": 0,
        "double": 0,
        "single": 0,
        "missed": 0,
        "bullseye": 0
    }
};

var user2 = {
    "user2":{
        "name": "Xinyue",
        "win_count": 0,
        "total_count": 0,
        "win_min_round": 0,
        "max": 0,
        "avg": 0,
        "triple": 0,
        "double": 0,
        "single": 0,
        "missed": 0,
        "bullseye": 0
    }
};

var user1_scoreset = []
var user2_scoreset = []
var user1_score = 301
var user2_score = 301
var curscore = 0
var round = 1
var user1_round = 0
var user2_round = 0
var wait = true
var can_cancel_user1 = false
var can_cancel_user2 = false

import { MongoClient } from 'mongodb';
import { equal } from 'assert';

// Connection URL
const url = 'mongodb+srv://user:<fSWKmC0Mm6QDPOfX>@cluster0-osvvn.mongodb.net/<dbname>?retryWrites=true&w=majority';

// Use connect method to connect to the Server
MongoClient.connect(url, function(err, client) {
  equal(null, err);
  client.close();
});

const db = client.db("test");

db.collection('user').insertOne({
    name: "Haozhi",
    win_count: 0,
    total_count: 0,
    win_min_round: 0,
    max: 0,
    avg: 0,
    triple: 0,
    double: 0,
    single: 0,
    missed: 0,
    bullseye: 0
})
db.collection('user').insertOne({
    name: "Xinyue",
    win_count: 0,
    total_count: 0,
    win_min_round: 0,
    max: 0,
    avg: 0,
    triple: 0,
    double: 0,
    single: 0,
    missed: 0,
    bullseye: 0
})

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
}

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
    $(".user1_board ul").append("<li id=user1_li_"+user1_round+">"+curscore+"<\li>") // Start from li_1
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
    $(".user2_board ul").append("<li id=user2_li_"+user2_round+">"+curscore+"<\li>") // Start from li_1
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
// wait=T user1submit wait=F user2submit count++ wait=T

$(".play_again").click(function(){
    user1_score = 301
    user2_score = 301
    user1_scoreset = []
    user2_scoreset = []
    curscore = 0
    round = 1
    user1_round = 0
    user2_round = 0
    wait = true
    can_cancel_user1 = false
    can_cancel_user2 = false

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

    $.get("/users", function(data,status){
        alert("Data: " + data + "nStatus: " + status);
    });
})
