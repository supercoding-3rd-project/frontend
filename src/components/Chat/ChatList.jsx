import React, { useState, useEffect } from "react";



export default function ChatList({chats, me, onSend}){

    const [text,setText] = useState('');
   
    return <>
        <div style={{width:'100%',height:'100%'}}>
            <div style={{height:'80%', background:'#f2f2f2',width:'100%',marginTop:'100px',overflow:'scroll',padding:'10px'}}>
                {chats.map(function(chat){

                    

                    return <div className={`msg-box ${chat.user==me ? 'right' : 'left'}`}>
                                <div>
                                    <div className='nick-tag'>{chat.user==me ? '나' : chat.user}</div>
                                    <div className='bubble'>{chat.content}</div>
                                </div>
                            </div>
                })}
            </div>   
            <div id="input-box">
                <input onChange={(e)=>{setText(e.target.value)}} value={text} id="msg-input" style={{width: '79%',height: '40px'}} class="form-control" type="text" placeholder="메세지 입력..."></input>
                <button onClick={()=>{
                    onSend(text);
                }} id="send-btn" style={{width: '19%',height: '40px',marginLeft: '4px',fontWeight: 700}} type="button" class="btn btn-dark">전송</button>
            </div> 
        </div>
    </>
}