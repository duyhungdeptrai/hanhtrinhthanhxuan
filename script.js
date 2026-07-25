// Preload trước các hình nền
new Image().src = "images/background1.jpg";
new Image().src = "images/background2.jpg";
new Image().src = "images/chapter2.jpg";

const screen1 = document.getElementById("screen1");
const curtain = document.getElementById("curtain");
const countdown = document.getElementById("countdown");
const opening = document.getElementById("opening");
const chapter1 = document.getElementById("chapter1");
const video1 = document.getElementById("video1");
const video2 = document.getElementById("video2");
const imageViewer = document.getElementById("imageViewer");

// Elements Video Chapter 2 & 3
const video3 = document.getElementById("video3");
const video4 = document.getElementById("video4");
const video5 = document.getElementById("video5");
const video6 = document.getElementById("video6");
const video7 = document.getElementById("video7");

const projectorStart = document.getElementById("projectorStart");
const projectorLoop = document.getElementById("projectorLoop");
const bgm = document.getElementById("bgm");
const countNumber = document.getElementById("count-number");
const bgm2 = document.getElementById("bgm2");
const titleChapter3 = document.getElementById("chapter3");
const bgm3 = document.getElementById("bgm3");

let started = false;

// ==========================================
// 1. HÀM STOP & RESET TẤT CẢ ÂM THANH/VIDEO (CHỐNG PHÁT ĐÈ)
// ==========================================
function stopAllMedia() {
    const allAudios = [projectorStart, projectorLoop, bgm, bgm2, bgm3];
    const allVideos = [video1, video2, video3, video4, video5, video6, video7];

    allAudios.forEach(a => {
        if (a) {
            a.pause();
            a.currentTime = 0;
            a.volume = 1;
        }
    });

    allVideos.forEach(v => {
        if (v) {
            v.pause();
            v.currentTime = 0;
            v.classList.remove("show");
        }
    });
}

// ==========================================
// 2. UNLOCK AUDIO AN TOÀN BẰNG WEB AUDIO API
// ==========================================
function unlockAudioContext() {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
            const ctx = new AudioContext();
            const buffer = ctx.createBuffer(1, 1, 22050);
            const source = ctx.createBufferSource();
            source.buffer = buffer;
            source.connect(ctx.destination);
            source.start(0);
            if (ctx.state === 'suspended') {
                ctx.resume();
            }
        }
    } catch (e) {
        console.log("AudioContext unlock err", e);
    }
}

// ==========================================
// 3. BẮT ĐẦU TRẢI NGHIỆM (CHẠM MÀN HÌNH)
// ==========================================
function startExperience() {
    if (started) return;
    started = true;

    // Tắt toàn bộ âm thanh thừa vãi vặt còn vướng từ lần load trước
    stopAllMedia();

    // Unlock quyền phát nhạc cho trình duyệt Mobile
    unlockAudioContext();

    // Toàn màn hình & Xoay ngang (Nếu Android hỗ trợ)
    if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().then(() => {
            if (screen.orientation && screen.orientation.lock) {
                screen.orientation.lock("landscape").catch(() => {});
            }
        }).catch(() => {});
    }

    // Fade out Intro & Kéo rèm
    if (screen1) screen1.classList.add("fade-out");
    if (curtain) curtain.classList.add("close");

    // Khi rèm khép kín (1.2s) -> Mở rèm & Hiện Countdown
    setTimeout(() => {
        if (curtain) {
            curtain.classList.remove("close");
            curtain.classList.add("open");
        }

        if (countdown) countdown.classList.add("show");
        const numbers = ["3", "2", "1"];
        let i = 0;
        if (countNumber) countNumber.textContent = numbers[i];

        const timer = setInterval(() => {
            i++;
            if (i < numbers.length) {
                if (countNumber) countNumber.textContent = numbers[i];
                if (numbers[i] === "2") {
                    document.body.classList.add("bg-movie");
                }
            } else {
                clearInterval(timer);

                setTimeout(() => {
                    if (countdown) countdown.classList.remove("show");

                    setTimeout(() => {
                        // CHỈ PHÁT ĐÚNG PROJECTOR START
                        if (projectorStart) {
                            projectorStart.currentTime = 0;
                            projectorStart.play().catch(() => playVideo1());

                            projectorStart.onended = () => {
                                // PROJECTOR START XONG MỚI PHÁT PROJECTOR LOOP
                                if (projectorLoop) {
                                    projectorLoop.currentTime = 0;
                                    projectorLoop.volume = 1;
                                    projectorLoop.play().catch(() => {});
                                }

                                if (opening) {
                                    opening.classList.remove("hide");
                                    opening.classList.add("show");
                                }

                                setTimeout(() => {
                                    if (opening) {
                                        opening.classList.remove("show");
                                        opening.classList.add("hide");
                                    }

                                    setTimeout(() => {
                                        document.body.classList.remove("bg-movie");
                                        document.body.classList.add("bg-chapter1");

                                        setTimeout(() => {
                                            if (chapter1) {
                                                chapter1.classList.remove("hide");
                                                chapter1.classList.add("show");
                                            }

                                            setTimeout(() => {
                                                if (chapter1) {
                                                    chapter1.classList.remove("show");
                                                    chapter1.classList.add("hide");
                                                }

                                                setTimeout(() => {
                                                    playVideo1();
                                                }, 1000);

                                            }, 2000);
                                        }, 500);
                                    }, 300);
                                }, 2000);
                            };
                        } else {
                            playVideo1();
                        }
                    }, 500);
                }, 300);
            }
        }, 800);
    }, 1200);
}

// Kích hoạt sự kiện
window.addEventListener("keydown", (e) => {
    if (e.key === "Enter") startExperience();
});
window.addEventListener("click", startExperience);
window.addEventListener("touchstart", startExperience);

// ==========================================
// 4. PHÁT VIDEO 1 & SLIDE ẢNH
// ==========================================
function playVideo1() {
    // Tắt projector loop khi bắt đầu vào video
    if (projectorLoop) fadeAudio(projectorLoop, 0, 1500, () => {
        projectorLoop.pause();
    });
    
    // Bắt đầu phát BGM 1
    if (bgm) {
        bgm.currentTime = 0;
        bgm.volume = 0;
        bgm.play().then(() => {
            fadeAudio(bgm, 1, 2000);
        }).catch(e => console.log("Lỗi bgm:", e));
    }

    setTimeout(() => {
        if (video1) {
            video1.currentTime = 0;
            video1.classList.add("show");
            video1.muted = false; // Bật âm thanh video
            video1.volume = 0.2;  // Set âm lượng Video 1 về 0.2 (20%)
            video1.play().catch(() => {});
            startTypewriterEffect();
        }
    }, 1200);

    if (video1) {
        video1.onended = () => {
            video1.classList.remove("show");
            video1.pause();

            const elLeft = document.getElementById("typewriter-left");
            const elRight = document.getElementById("typewriter-right");
            if (elLeft) elLeft.textContent = "";
            if (elRight) elRight.textContent = "";

            if (imageViewer) {
                imageViewer.src = "images/image1.jpg";
                imageViewer.classList.add("show");
            }

            setTimeout(() => changeImage("images/image2.jpg"), 3000);
            setTimeout(() => changeImage("images/image3.jpg"), 6000);
            setTimeout(() => changeImage("images/image4.jpg"), 9000);

            setTimeout(() => {
                if (imageViewer) imageViewer.classList.remove("show");
            }, 12000);

            setTimeout(() => {
                playVideo2();
            }, 12000);
        };
    }
}

// ==========================================
// 5. PHÁT VIDEO 2 & CHUYỂN CHAPTER 1 -> 2
// ==========================================
function playVideo2() {
    if (!video2) return;
    video2.currentTime = 0;
    video2.classList.add("show");
    video2.muted = false;
    video2.play().catch(() => {});

    video2.onended = () => {
        video2.classList.remove("show");
        video2.pause();

        const outroScreen = document.getElementById("outro-screen");
        const outroText = document.getElementById("outro-text");
        const quoteContent = "Và thế là, những mảnh ký ức đẹp nhất của Thanh Xuân đã được lưu giữ lại mãi mãi...";

        setTimeout(() => {
            if (outroScreen) outroScreen.classList.add("show");

            setTimeout(() => {
                if (outroText) {
                    outroText.textContent = "";
                    outroText.classList.remove("done");

                    typeWriter(outroText, quoteContent, 70, () => {
                        setTimeout(() => {
                            // Tắt hoàn toàn BGM 1
                            if (bgm) fadeAudio(bgm, 0, 2500, () => {
                                bgm.pause();
                                bgm.currentTime = 0;
                            });

                            setTimeout(() => {
                                // CHỈ BẮT ĐẦU PHÁT BGM 2 TẠI ĐÂY
                                if (bgm2) {
                                    bgm2.currentTime = 0;
                                    bgm2.volume = 0;
                                    bgm2.play().then(() => {
                                        fadeAudio(bgm2, 1.0, 2000);
                                    }).catch(e => console.log("Lỗi phát bgm2:", e));
                                }

                                if (outroScreen) outroScreen.classList.remove("show");

                                document.body.classList.remove("bg-chapter1");
                                document.body.classList.add("bg-chapter2");

                                setTimeout(() => {
                                    startChapter2();
                                }, 1500);

                            }, 2600);
                        }, 5000);
                    });
                }
            }, 1000);
        }, 500);
    };
}

// ==========================================
// 6. LOGIC CHAPTER 2
// ==========================================
function startChapter2() {
    const chapter2Screen = document.getElementById("chapter2-screen");
    if (chapter2Screen) chapter2Screen.classList.add("show");

    setTimeout(() => {
        if (chapter2Screen) chapter2Screen.classList.remove("show");

        setTimeout(() => {
            runChapter2Content();
        }, 1500);

    }, 3500);
}

function runChapter2Content() {
    startTypewriterForVideo3();

    playMutedVideo(video3, () => {
        const elLeft = document.getElementById("typewriter-v3-left");
        const elRight = document.getElementById("typewriter-v3-right");
        if (elLeft) elLeft.textContent = "";
        if (elRight) elRight.textContent = "";

        playMutedVideo(video4, () => {
            if (imageViewer) {
                imageViewer.src = "images/image5.jpg";
                imageViewer.classList.add("show");
            }

            setTimeout(() => changeImage("images/image6.jpg"), 3000);
            setTimeout(() => changeImage("images/image7.jpg"), 6000);

            setTimeout(() => {
                if (imageViewer) imageViewer.classList.remove("show");
            }, 9000);

            setTimeout(() => {
                playMutedVideo(video5, () => {
                    playMutedVideo(video6, () => {
                        if (imageViewer) {
                            imageViewer.src = "images/image8.jpg";
                            imageViewer.classList.add("show");
                        }

                        setTimeout(() => changeImage("images/image9.jpg"), 3000);

                        setTimeout(() => {
                            if (imageViewer) imageViewer.classList.remove("show");
                        }, 6000);

                        setTimeout(() => {
                            runChapter2Outro();
                        }, 7200);

                    });
                });
            }, 9000);

        });
    });
}

function playMutedVideo(videoEl, onEndedCallback) {
    if (!videoEl) {
        if (onEndedCallback) onEndedCallback();
        return;
    }
    videoEl.currentTime = 0;
    videoEl.classList.add("show");
    videoEl.muted = true;
    videoEl.play().catch(err => {
        if (onEndedCallback) onEndedCallback();
    });

    videoEl.onended = () => {
        videoEl.classList.remove("show");
        videoEl.pause();
        if (onEndedCallback) onEndedCallback();
    };
}

function runChapter2Outro() {
    const outroScreen = document.getElementById("outro-screen");
    const outroText = document.getElementById("outro-text");
    const quoteChapter2 = "Những ngày tháng chúng ta cùng gặt hái tiếng cười, sẽ mãi là những trang ký ức rực rỡ nhất...";

    if (outroText) {
        outroText.textContent = "";
        outroText.classList.remove("done");
    }

    if (outroScreen) outroScreen.classList.add("show");

    setTimeout(() => {
        typeWriter(outroText, quoteChapter2, 75, () => {
            setTimeout(() => {
                if (outroScreen) outroScreen.classList.remove("show");
                
                // Tắt hoàn toàn BGM 2
                if (bgm2) fadeAudio(bgm2, 0, 2000, () => {
                    bgm2.pause();
                    bgm2.currentTime = 0;
                });

                document.body.classList.remove("bg-chapter2");
                document.body.classList.add("bg-chapter3");

                setTimeout(() => {
                    if (outroText) outroText.textContent = "";
                    startChapter3();
                }, 2100);

            }, 5000);
        });
    }, 1000);
}

// ==========================================
// 7. LOGIC CHAPTER 3
// ==========================================
function startChapter3() {
    // CHỈ BẮT ĐẦU PHÁT BGM 3 TẠI ĐÂY
    if (bgm3) {
        bgm3.currentTime = 0;
        bgm3.volume = 0;
        bgm3.play().then(() => {
            fadeAudio(bgm3, 1.0, 2500);
        }).catch(e => console.log("Lỗi phát bgm3:", e));
    }

    const ch3 = document.getElementById("chapter3");

    if (ch3) {
        setTimeout(() => {
            ch3.style.visibility = "visible";
            ch3.style.opacity = "1"; 

            setTimeout(() => {
                ch3.style.opacity = "0"; 

                setTimeout(() => {
                    ch3.style.visibility = "hidden";
                    runChapter3Content();
                }, 1500);

            }, 3500); 

        }, 500);
    } else {
        runChapter3Content();
    }
}

function runChapter3Content() {
    const outroScreen = document.getElementById("outro-screen");
    const outroText = document.getElementById("outro-text");
    
    const quote1 = "Cảm ơn em vì đã xuất hiện và cùng anh tạo nên những ký ức tuyệt vời nhất...";

    if (outroText) {
        outroText.textContent = "";
        outroText.classList.remove("done");
    }

    if (outroScreen) outroScreen.classList.add("show");

    setTimeout(() => {
        typeWriter(outroText, quote1, 75, () => {
            setTimeout(() => {
                if (outroScreen) outroScreen.classList.remove("show");

                setTimeout(() => {
                    if (outroText) outroText.textContent = "";
                    playVideo7();
                }, 1200);

            }, 4000);
        });
    }, 1000);
}

function playVideo7() {
    if (!video7) {
        runChapter3Ending();
        return;
    }

    video7.currentTime = 0;
    video7.muted = true;
    video7.classList.add("show");
    
    video7.play().catch(err => console.error("Lỗi phát video7:", err));

    video7.ontimeupdate = () => {
        if (video7.duration - video7.currentTime <= 1.5 && !video7.isFadingOut) {
            video7.isFadingOut = true;
            video7.classList.remove("show");
        }
    };

    video7.onended = () => {
        video7.isFadingOut = false;
        video7.pause();
        setTimeout(() => {
            runChapter3Ending();
        }, 800);
    };
}

function runChapter3Ending() {
    const outroScreen = document.getElementById("outro-screen");
    const outroText = document.getElementById("outro-text");
    const tbcHighlight = document.getElementById("tbc-highlight");

    const quote2 = "Hy vọng sau này chúng ta vẫn luôn cùng nhau bước tiếp trên những hành trình phía trước...";
    const tbcText = "To be continued...";

    if (outroText) {
        outroText.textContent = "";
        outroText.classList.remove("done");
    }
    if (tbcHighlight) {
        tbcHighlight.textContent = "";
    }

    document.body.classList.remove("bg-chapter3");
    document.body.classList.remove("bg-movie");

    if (outroScreen) outroScreen.classList.add("show");

    setTimeout(() => {
        typeWriter(outroText, quote2, 75, () => {
            setTimeout(() => {
                if (tbcHighlight) {
                    typeWriter(tbcHighlight, tbcText, 85, () => {
                        setTimeout(() => {
                            if (bgm3) fadeAudio(bgm3, 0, 3000, () => {
                                bgm3.pause();
                                bgm3.currentTime = 0;
                            });

                            setTimeout(() => {
                                if (outroScreen) outroScreen.classList.remove("show");
                                runFinalOutro();
                            }, 3200);

                        }, 4000);
                    });
                } else {
                    runFinalOutro();
                }
            }, 500);
        });
    }, 1000);
}

// ==========================================
// 8. HÀM BỔ TRỢ (FADE AUDIO AN TOÀN)
// ==========================================
function fadeAudio(audio, targetVolume, duration, onComplete) {
    if (!audio) return;
    const startVolume = audio.volume;
    const startTime = performance.now();

    function update(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        audio.volume = startVolume + (targetVolume - startVolume) * progress;
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            if (onComplete) onComplete();
        }
    }
    requestAnimationFrame(update);
}

function changeImage(src) {
    if (!imageViewer) return;
    imageViewer.classList.remove("show");

    setTimeout(() => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
            imageViewer.src = src;
            imageViewer.classList.add("show");
        };
    }, 1000);
}

function startTypewriterEffect() {
    const textLeft = "Những khoảnh khắc đơn giản lại vô tình";
    const textRight = "trở thành những điều hạnh phúc nhất";

    const elLeft = document.getElementById("typewriter-left");
    const elRight = document.getElementById("typewriter-right");

    if (!elLeft || !elRight) return;

    elLeft.textContent = "";
    elRight.textContent = "";
    elLeft.classList.remove("done");
    elRight.classList.remove("done");

    typeWriter(elLeft, textLeft, 70, () => {
        setTimeout(() => {
            typeWriter(elRight, textRight, 70);
        }, 300);
    });
}

function startTypewriterForVideo3() {
    const textLeft = "cuộc sống hằng ngày khi nào vẫn còn phải đơn độc";
    const textRight = "mà giờ đây lại kết nối lấy hai trái tim, chia sẻ và đồng hành";

    const elLeft = document.getElementById("typewriter-v3-left");
    const elRight = document.getElementById("typewriter-v3-right");

    if (!elLeft || !elRight) return;

    elLeft.textContent = "";
    elRight.textContent = "";
    elLeft.classList.remove("done");
    elRight.classList.remove("done");

    typeWriter(elLeft, textLeft, 70, () => {
        setTimeout(() => {
            typeWriter(elRight, textRight, 70);
        }, 300);
    });
}

function typeWriter(element, text, speed, callback) {
    if (!element) return;
    let i = 0;
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else {
            element.classList.add("done");
            if (callback) callback();
        }
    }
    type();
}

// ==========================================
// 9. MOVIE CREDITS
// ==========================================
function runFinalOutro() {
    const creditsScreen = document.getElementById("credits-screen");

    if (creditsScreen) {
        creditsScreen.classList.add("show");
        setTimeout(() => {
            creditsScreen.classList.add("start");
        }, 600);
    }
}