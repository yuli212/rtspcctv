import { useState, useEffect, useRef } from 'react';

export function useWHEP(url) {
    const videoRef = useRef(null);
    const pcRef = useRef(null);
    const [status, setStatus] = useState('connecting'); // connecting, connected, disconnected, failed
    const [error, setError] = useState(null);

    useEffect(() => {
        let isComponentMounted = true;
        let reconnectTimeout;

        const connect = async () => {
            if (!isComponentMounted) return;
            
            setStatus('connecting');
            setError(null);

            const pc = new RTCPeerConnection();
            pcRef.current = pc;

            pc.addTransceiver('video', { direction: 'recvonly' });
            // pc.addTransceiver('audio', { direction: 'recvonly' });

            pc.ontrack = (event) => {
                if (videoRef.current && videoRef.current.srcObject !== event.streams[0]) {
                    videoRef.current.srcObject = event.streams[0];
                }
            };

            pc.onconnectionstatechange = () => {
                if (!isComponentMounted) return;
                
                console.log(`[WHEP] ${url} state:`, pc.connectionState);
                if (pc.connectionState === 'connected') {
                    setStatus('connected');
                } else if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
                    setStatus('disconnected');
                    // Auto-reconnect
                    clearTimeout(reconnectTimeout);
                    reconnectTimeout = setTimeout(() => {
                        console.log(`[WHEP] Reconnecting to ${url}...`);
                        cleanup();
                        connect();
                    }, 3000);
                }
            };

            try {
                const offer = await pc.createOffer();
                await pc.setLocalDescription(offer);

                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/sdp' },
                    body: offer.sdp
                });

                if (!response.ok) {
                    throw new Error(`HTTP Error: ${response.status}`);
                }

                const answerSdp = await response.text();
                await pc.setRemoteDescription({ type: 'answer', sdp: answerSdp });

            } catch (err) {
                if (!isComponentMounted) return;
                console.error(`[WHEP] Connection failed for ${url}:`, err);
                setStatus('failed');
                setError(err.message);
                
                clearTimeout(reconnectTimeout);
                reconnectTimeout = setTimeout(() => {
                    cleanup();
                    connect();
                }, 5000);
            }
        };

        const cleanup = () => {
            if (pcRef.current) {
                pcRef.current.close();
                pcRef.current = null;
            }
            if (videoRef.current) {
                videoRef.current.srcObject = null;
            }
        };

        connect();

        return () => {
            isComponentMounted = false;
            clearTimeout(reconnectTimeout);
            cleanup();
        };
    }, [url]);

    return { videoRef, status, error };
}
