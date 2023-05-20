import React, { useEffect, useState, useRef} from 'react';
import audioFile from './BackgroundMusic.mp3'; // Replace with the path to your audio file
import "styles/views/Homepage.scss";
import { IconButton, Box } from '@mui/material';
import MusicNoteOnIcon from '@mui/icons-material/MusicNote';
import MusicOffIcon from '@mui/icons-material/MusicOff';

const BackgroundMusic = () => {
  const [muted, setMuted] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    audio.loop = true;
    audio.volume = muted ? 0 : 1;
    audio.play();

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [muted]);

  const handleToggleMute = () => {
    setMuted((prevMuted) => !prevMuted);
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 5,
        right: 5,
        zIndex: 999,
      }}
    >
      <IconButton onClick={handleToggleMute}>
        {muted ? (
          <MusicOffIcon sx={{ fontSize: 30, color: '#ff7277' }} />
        ) : (
          <MusicNoteOnIcon sx={{ fontSize: 30, color: '#ff7277' }} />
        )}
      </IconButton>
      <audio ref={audioRef} src={audioFile} />
    </Box>
  );
};

export default BackgroundMusic;