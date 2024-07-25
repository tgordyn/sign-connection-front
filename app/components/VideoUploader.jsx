"use client"
import React, { useState, useRef, useEffect } from 'react';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import { v4 as uuidv4 } from 'uuid';

const VideoUploader = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [videoURL, setVideoURL] = useState('');
  const [translation, setTranslation] = useState('');
  const [activeTab, setActiveTab] = useState('upload');
  const [error, setError] = useState('');
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [stream, setStream] = useState(null);
  const [countdown, setCountdown] = useState(null); // Nuevo estado para el temporizador
  const [isRecording, setIsRecording] = useState(false); // Nuevo estado para el estado de grabación
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const tabsRef = useRef(null);
  const [greeting, setGreeting] = useState('');
  const apiPath = 'https://my-fastapi-app-kw6lwxxmga-rj.a.run.app/';

  useEffect(() => {
    const fetchGreeting = async () => {
      try {
        const response = await fetch(apiPath);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setGreeting(data.greeting);
      } catch (error) {
        console.error('Error fetching greeting:', error);
      }
    };

    fetchGreeting();
  }, []);

  const startStream = async () => {
    try {
      Loading.circle('Accediendo a la cámara...');
      const userStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      videoRef.current.srcObject = userStream;
      setStream(userStream);
    } catch (err) {
      console.error('Error accessing camera:', err);
    } finally {
      Loading.remove();
    }
  };

  const stopStream = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  useEffect(() => {
    if (activeTab === 'record') {
      tabsRef.current.scrollIntoView({ behavior: 'smooth' });
      startStream();
    } else if (stream) {
      stopStream();
    }
    if (activeTab === 'view') {
      tabsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeTab]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setVideoFile(file);
    setVideoURL(URL.createObjectURL(file));
    setActiveTab('view');
    setTranslation('');
    setError('');
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    setVideoFile(file);
    setVideoURL(URL.createObjectURL(file));
    setActiveTab('view');
    setTranslation('');
    setError('');
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleTranslate = async () => {
    const formData = new FormData();
    formData.append('video', videoFile);

    try {
      Loading.circle('Traduciendo...');
      const response = await fetch(`${apiPath}/predict`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setTranslation(data.message);
        setError('');
      } else {
        throw new Error('Error al traducir el video');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      Loading.remove();
    }
  };

  const handleTextClick = () => {
    fileInputRef.current.click();
  };

  const generateShortId = () => {
    return Math.random().toString(36).substring(2, 7);
  };

  const startCountdown = (seconds, onComplete) => {
    let counter = seconds;
    setCountdown(counter);
    const interval = setInterval(() => {
      counter -= 1;
      setCountdown(counter);
      if (counter === 0) {
        clearInterval(interval);
        onComplete();
        setCountdown(null);
      }
    }, 1000);
  };

  const handleStartRecording = () => {
    startCountdown(3, () => {
      setIsRecording(true); // Indicar que la grabación ha comenzado
      const mediaRecorderInstance = new MediaRecorder(stream, {
        mimeType: 'video/webm; codecs=vp9' // Usa un codec compatible y eficiente
      });
      setMediaRecorder(mediaRecorderInstance);
      const chunks = [];
      mediaRecorderInstance.ondataavailable = (event) => {
        chunks.push(event.data);
      };
      mediaRecorderInstance.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const uniqueId = generateShortId(); // Genera un ID único corto
        const file = new File([blob], `recorded-video-${uniqueId}.webm`, { type: 'video/webm' });
        setVideoFile(file);
        setVideoURL(URL.createObjectURL(blob));
        setActiveTab('view');
        setTranslation('');
        setError('');
        setIsRecording(false); // Indicar que la grabación ha terminado
      };
      mediaRecorderInstance.start();
      setTimeout(() => {
        mediaRecorderInstance.stop();
      }, 3000);
    });
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex mb-12" ref={tabsRef}>
        <button
          onClick={() => setActiveTab('upload')}
          className={`px-4 py-2 mr-6 rounded ${activeTab === 'upload' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Seleccionar Video
        </button>
        <button
          onClick={() => setActiveTab('record')}
          className={`px-4 py-2 mr-6 rounded ${activeTab === 'record' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Grabar Video
        </button>
        <button
          onClick={() => setActiveTab('view')}
          className={`px-4 py-2 rounded ${activeTab === 'view' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Ver Video
        </button>
      </div>

      {activeTab === 'upload' && (
        <div
          className="w-3/4 h-52 border-4 border-dashed border-gray-400 rounded-lg flex items-center justify-center mb-4"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <p className="text-Gris-claro w-3/4 mt-12 mb-12 text-center text-xl">
            Arrastre un archivo de video en mp4 o <span onClick={handleTextClick} className="underline cursor-pointer">haga click para seleccionar localmente</span>
          </p>
          <input
            type="file"
            accept=".mp4"
            onChange={handleFileChange}
            className="hidden"
            ref={fileInputRef}
          />
        </div>
      )}

      {activeTab === 'record' && (
        <div className="flex flex-col items-center mb-4 w-3/4 h-auto">
          <video ref={videoRef} autoPlay className="w-1/2 h-auto mb-4" />
          {countdown ? (
            <div className="mb-4 px-4 py-2 bg-blue-500 text-white rounded">
              Grabando en {countdown}
            </div>
          ) : isRecording ? (
            <button className="mb-4 px-4 py-2 bg-red-500 text-white rounded">
              Grabando...
            </button>
          ) : (
            <button onClick={handleStartRecording} className="mb-4 px-4 py-2 bg-blue-500 text-white rounded">
              Grabar (3 segundos)
            </button>
          )}
        </div>
      )}

      {activeTab === 'view' && videoURL && (
        <div className="flex justify-center items-center mb-4 h-auto">
          <video src={videoURL} controls className="mb-4 w-[640px] h-[360px]" />
        </div>
      )}

      <button
        onClick={handleTranslate}
        className="mb-4 mt-12 px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!videoFile}
      >
        Traducir
      </button>

      <div className="p-4 mt-4 border rounded bg-gray-100 w-3/4 text-center">
        <h2 className="text-xl font-bold mb-2">
          {error ? 'Error en el request:' : videoFile ? <>Traducción: <span className='text-green-700'>{videoFile.name}</span></> : ''}
        </h2>
        <p className="text-lg">
          {error ? error : (
            translation ? <span className="text-2xl text-blue-600 font-bold">"{translation}"</span> : (videoFile && !translation && 'Haga click en Traducir')
          )}
        </p>
        {!videoFile && !translation && !error && (
          <p className="text-lg">Seleccione o grabe un video para procesar</p>
        )}
      </div>
    </div>
  );
};

export default VideoUploader;
