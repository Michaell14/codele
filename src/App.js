import logo from './logo.svg';
import './App.css';
import React, {useState, useEffect} from "react";
import { Center, useDisclosure, Box, Flex, Button, Text, Grid,GridItem } from '@chakra-ui/react';
import $ from  "jquery";
import anime from 'animejs/lib/anime.es.js';
import { RepeatIcon } from '@chakra-ui/icons'

import processData from "./getCurrWord";

let counter=0;
let row=1;
let newWord="";
var done=false;

function App() {

    const [letterList, setLetterList] = useState([]);
    const [templateCols, setTemplateCols] = useState("");
    
    useEffect(() => {
      
      $(document).ready(function(){
        $.ajax({
          url: 'repos.csv',
          dataType: 'text',
          success: function(data) {
            if (!done){
              done=true;
            
            newWord = processData(data);
            //console.log("end2:" +newWord);

            //Adds grid boxes for each letter
            const counter = Math.pow(newWord.length, 2);
            for (let i=0; i<counter; i++){
                letterList.push(<GridItem className={"gridBox"} key={Math.random()}><Center boxShadow='md' maxW={"100px"} w={"12vw"} maxH={"100px"} h={"12vw"} borderRadius={"5px"} border={"solid 1px black"}><Text fontSize={"4xl"} mt={"3px"} id={i}></Text></Center></GridItem>)
            }
  
            setTemplateCols("repeat("+newWord.length+", 1fr)");
          }}
        });

      })
    })

  return (
    <>
      
      

      <Center><Text fontSize="5xl" my={5}>Codele</Text></Center>
      <Button onClick={reloadPage} colorScheme={"green"} variant={"outline"} rightIcon={<RepeatIcon />} id={"restartBtn"}  position={"absolute"} top={8} right={10}>Restart</Button>
  
      <Center>
          <Grid templateColumns={templateCols} mx={"auto"} gap={2}>
          {letterList}
          </Grid>
      </Center>

    </>
  );
}


function reloadPage(){
  window.location.reload();
}

$(document).ready(function(){

  //When a letter is typed
  $(document).keyup(function(event){
    
    //When backspace is typed, erase a letter
    if (event.keyCode==8){
      if (counter>(row-1)*newWord.length){
        counter--;
      }
      $("#"+counter).text("");

    //When a letter of the alphebet is typed
    }else if (event.keyCode>=65 && event.keyCode<=90){
      
      if (counter<newWord.length*row){
        $("#"+counter).text(event.key);
        counter++;
      }

    //When enter is pressed
    }else if (event.keyCode==13){
      
      if (counter%newWord.length==0){
        
        var guess=true;
        
        //Timeline to animate each letter
        var t1 = anime.timeline({
          delay: function(el, i){return i*300},
          duration: 280, 
          easing: "easeInOutQuad"
        })

        //Determines the accuracy of each entered letter
        for (let i=counter-newWord.length; i<counter; i++){
          const newWordLetter=newWord.substring(i%newWord.length, i%newWord.length+1);
          const enteredLetter=$("#"+i).text();

          let newColor="#E5E5E5";

          if (newWordLetter == enteredLetter){
            newColor="#6FEBA2";
          }else{
            if (newWord.includes(enteredLetter)){
              newColor="#F5EC84";
            }
            guess=false;
          }

          //Guessing animation when "enter" is pressed
          t1.add({
            targets: $("#"+i).parentsUntil(".gridbox")[1],
            background: newColor,
            keyframes:[
              {scale: 1},
              {scale: 1.1},
              {scale: 1.15},
              {scale: 1.2},
              {scale: 1.25},
              {scale: 1.28},
              {scale: 1.25},
              {scale: 1.2},
              {scale: 1.15},
              {scale: 1.1},
              {scale: 1},
            ]
          })
        }

        //Checks if the guess was correct
        if (guess){
          alert("Congrats you got it right!")

        //Checks last guess
        }else if (!guess && counter>=Math.pow(newWord.length, 2)-1){
          alert("Sorry, the word was: " + newWord)
        }

        row++;
      }
    }
  });
});


export default App;
