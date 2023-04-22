import React, { useRef } from "react";
import { useHistory } from 'react-router-dom';
import 'styles/views/Endscreen.scss';
import TabooLogo from './TabooLogo.png';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import StarIcon from '@mui/icons-material/Star';


const Endscreen = props => {
  const history = useHistory();
  const canvasRef = useRef(null);

  const doHomepage = () => {
    localStorage.removeItem('token');
    history.push(`/homepage`);
    window.location.reload();
  };

  const doShare = async () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      alert('Could not create screenshot.');
      return;
    }
  
    const dataUrl = canvas.toDataURL();
    const uploadUrl = 'https://api.imgur.com/3/image';
    const response = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        Authorization: 'Client-ID <your-client-id>',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: dataUrl.replace('data:image/png;base64,', ''),
    });
    const json = await response.json();
    const imageUrl = json.data.link;
    const tweetText = 'New Taboo Win!';
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(window.location.href)}&hashtags=Taboo&media=${encodeURIComponent(imageUrl)}`;
    
    window.open(tweetUrl, '_blank');
  };
  
    

  return (
    <div className="endScreenRoot">
      <img src={TabooLogo} alt="Taboo logo" style={{maxWidth: "100%", maxHeight: "40%"}} />
      <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        marginTop: '-50px'
      }}
    >
      
      <h1 className="h1">YOU PLAYED 7 ROUNDS</h1>
      <h1 className="h1">SCORES</h1>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '50px', marginBottom: '50px'}}>
      <div className="textPanel" style={{margin: '-30px 20px -30px 50px'}}>
        <h1 className="h1" style={{fontSize: '26px'}}>TEAM 1</h1>
        <h1 className="h1" style={{fontSize: '50px', marginTop: '-45px'}}>10</h1>
      </div>
      <div className="textPanel" style={{margin: '-30px 50px -30px 20px'}}>
      <h1 className="h1" style={{fontSize: '26px'}}>TEAM 2</h1>
      <h1 className="h1" style={{fontSize: '50px', marginTop: '-45px'}}>12</h1>
      </div>
    </div>

    <div></div>

    <div style={{ display: 'flex', alignItems: 'center', gap: '20px'}}>
    <StarIcon style={{ color: '#EA854C', margin: '0 -20 0 75', fontSize: '50px'}} />
    <h1 className="h1" style={{ fontSize: '24px', width: '200px'}}>TEAM 2 WINS!</h1>
    <StarIcon style={{ color: '#EA854C', margin: '0 50 0 -20', fontSize: '50px'}} />
    </div>



    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '50px'}}>
    <Button variant="contained" style={{ width: '150px', height: '60px', margin: '-0px 20px -30px 50px', fontSize: '20px' }}
            className="button"
            onClick={() => doShare()}
          >
            Share
          </Button>
      <Button variant="contained" style={{width: '150px', height: '60px', margin: '-0px 50px -30px 20px', fontSize: '20px'}}
        className="button"
        onClick={() =>doHomepage()}
        >
        Homepage
      </Button>
    </div>
    <canvas ref={canvasRef} style={{ display: 'none' }} width={window.innerWidth} height={window.innerHeight}></canvas>

    </Box>
    </div>
  );
};

export default Endscreen;