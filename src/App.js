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
            const counter = Math.pow(newWord.length, 2);
            for (let i=0; i<counter; i++){
                letterList.push(<GridItem className={"gridBox"} key={Math.random()}><Center boxShadow='md' w={"100px"} h={"100px"} borderRadius={"5px"} border={"solid 1px black"}><Text fontSize={"4xl"} mt={"3px"} id={i}></Text></Center></GridItem>)
            }
  
            setTemplateCols("repeat("+newWord.length+", 1fr)");
          }}
        });

      })
    })

  return (
    <>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossOrigin="anonymous"></link>
      

        <Center><Text fontSize="5xl" my={5}>Codele</Text></Center>
        <Button onClick={reloadPage} colorScheme={"green"} variant={"outline"} rightIcon={<RepeatIcon />} position={"absolute"} top={8} right={10}>Restart</Button>
  
      <Center>
          <Grid templateColumns={templateCols} maxW={"60vw"} gap={5}>
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

  $(document).keyup(function(event){
    if (event.keyCode==8){
      if (counter>(row-1)*newWord.length){
        
        counter--;
      }
      $("#"+counter).text("");
    }else if (event.keyCode>=65 && event.keyCode<=90){
      
      console.log(counter + " " + newWord.length)
      if (counter<newWord.length*row){
        $("#"+counter).text(event.key);
        counter++;
      }
    }else if (event.keyCode==13){
      
      if (counter>=Math.pow(newWord.length, 2)-1){
        alert("Sorry, the word was: " + newWord)
      }

      if (counter%newWord.length==0){
        
        var guess=true;
        var t1 = anime.timeline({
          delay: function(el, i){return i*300},
          duration: 280, 
          easing: "easeInOutQuad"
        })

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

        if (guess){
          console.log("Congrats you got it right!")
        }

        row++;
      }
    }
  });
});




export default App;
