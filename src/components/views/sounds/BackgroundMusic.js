import React, {useEffect, useRef, useState} from 'react';
import audioFile from './BackgroundMusic.mp3'; // Replace with the path to your audio file
import "styles/views/Homepage.scss";
import {Box, IconButton} from '@mui/material';
import MusicNoteOnIcon from '@mui/icons-material/MusicNote';
import MusicOffIcon from '@mui/icons-material/MusicOff';

const BackgroundMusic = () => {
    const [muted, setMuted] = useState(true);
    const audioRef = useRef(null);

    useEffect(() => {
        const audio = audioRef.current;
        audio.loop = true;
    }, []);

    const handleToggleMute = () => {
        setMuted((prevMuted) => !prevMuted);
        const audio = audioRef.current;
        audio.muted = !audio.muted;
        if (!audio.paused && audio.muted) {
            audio.pause();
        } else if (audio.paused && !audio.muted) {
            audio.play();
        }
    };

    return (<Box
            sx={{
                position: 'fixed', bottom: 5, right: 5, zIndex: 999,
            }}
        >
            <IconButton onClick={handleToggleMute}>
                {muted ? (<MusicOffIcon sx={{fontSize: 30, color: '#ff7277'}}/>) : (
                    <MusicNoteOnIcon sx={{fontSize: 30, color: '#ff7277'}}/>)}
            </IconButton>
            <audio ref={audioRef} src={audioFile} autoPlay muted/>
        </Box>);
};

export default BackgroundMusic;
