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

// Kiếm tra xem thiết bị có phải là Điện thoại / Màn hình nhỏ hay không
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;

// ==========================================
// 1. CÁC HÀM XỬ LÝ ÂM THANH
// ==========================================
function fadeAudio(audio, targetVolume, duration) {
    if (!audio || isMobile) return; // Mobile bỏ qua fadeVolume để tránh lag
    const startVolume = audio.volume;
    const startTime = performance.now();

    function update(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        audio.volume = startVolume + (targetVolume - startVolume) * progress;
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    requestAnimationFrame(update);
}

function safePause(audio) {
    if (!audio) return;
    try { audio.pause(); } catch(e) {}
}

function safePlay(audio, volume = 1.0) {
    if (!audio) return;
    try {
        audio.volume = volume;
        const p = audio.play();
        if (p !== undefined) {
            p.catch(err => console.log("Audio play err:", err));
        }
    } catch(e) {}
}

// ==========================================
// 2. KÍCH HOẠT KHI BẤM CHUỘT / PHÍM / CHẠM
// ==========================================
function startExperience() {
    if (started) return;
    started = true;

    if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
    }

    if (screen1) screen1.classList.add("fade-out");
    if (curtain) curtain.classList.add("close");

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
                        if (projectorStart) {
                            safePlay(projectorStart);

                            projectorStart.onended = () => {
                                if (projectorLoop) {
                                    safePlay(projectorLoop);
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

window.addEventListener("keydown", (e) => {
    if (e.key === "Enter") startExperience();
});
window.addEventListener("click", startExperience);
window.addEventListener("touchstart", startExperience, { passive: true });

// ==========================================
// 3. PHÁT VIDEO 1
// ==========================================
function playVideo1() {
    safePause(projectorLoop);
    
    if (bgm) {
        bgm.volume = isMobile ? 1.0 : 0;
        safePlay(bgm, bgm.volume);
        if (!isMobile) fadeAudio(bgm, 1, 2000);
    }

    setTimeout(() => {
        if (video1) {
            video1.classList.add("show");
            
            // Nếu là Mobile -> Tắt tiếng Video 1 để không bị Safari/Chrome chặn
            video1.muted = isMobile;

            const p = video1.play();
            if (p !== undefined) {
                p.catch(err => {
                    console.log("Autoplay blocked, retrying with muted...", err);
                    video1.muted = true;
                    video1.play();
                });
            }

            startTypewriterEffect();
        }
    }, 1200);

    if (video1) {
        video1.onended = () => {
            video1.classList.remove("show");
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
// 4. PHÁT VIDEO 2 & CHUYỂN CHAPTER 1 -> 2
// ==========================================
function playVideo2() {
    if (!video2) return;
    video2.currentTime = 0;
    video2.classList.add("show");
    
    // Nếu là Mobile -> Tắt tiếng Video 2
    video2.muted = isMobile;

    const p = video2.play();
    if (p !== undefined) {
        p.catch(err => {
            video2.muted = true;
            video2.play();
        });
    }

    video2.onended = () => {
        video2.classList.remove("show");

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
                            if (bgm && !isMobile) fadeAudio(bgm, 0, 2500);

                            setTimeout(() => {
                                safePause(bgm);

                                if (bgm2) {
                                    bgm2.volume = isMobile ? 1.0 : 0;
                                    safePlay(bgm2, bgm2.volume);
                                    if (!isMobile) fadeAudio(bgm2, 1.0, 2000);
                                }

                                if (outroScreen) outroScreen.classList.remove("show");

                                document.body.classList.remove("bg-chapter1");
                                document.body.classList.add("bg-chapter2");

                                setTimeout(() => {
                                    startChapter2();
                                }, 1500);

                            }, 2600);
                        }, 4000);
                    });
                }
            }, 1000);
        }, 500);
    };
}

// ==========================================
// 5. LOGIC CHAPTER 2
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
    
    const p = videoEl.play();
    if (p !== undefined) {
        p.catch(err => {
            console.error("Video play error:", err);
            videoEl.classList.remove("show");
            if (onEndedCallback) onEndedCallback();
        });
    }

    videoEl.onended = () => {
        videoEl.classList.remove("show");
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
                
                if (bgm2 && !isMobile) fadeAudio(bgm2, 0, 2000);

                document.body.classList.remove("bg-chapter2");
                document.body.classList.add("bg-chapter3");

                setTimeout(() => {
                    if (outroText) outroText.textContent = "";
                    safePause(bgm2);
                    startChapter3();
                }, 2100);

            }, 4000);
        });
    }, 1000);
}

// ==========================================
// 6. UTILITIES
// ==========================================
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
// 7. LOGIC CHAPTER 3
// ==========================================
function startChapter3() {
    if (bgm3) {
        bgm3.volume = isMobile ? 1.0 : 0;
        safePlay(bgm3, bgm3.volume);
        if (!isMobile) fadeAudio(bgm3, 1.0, 2500);
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
    
    video7.play().catch(() => {});

    video7.ontimeupdate = () => {
        if (video7.duration - video7.currentTime <= 1.5 && !video7.isFadingOut) {
            video7.isFadingOut = true;
            video7.classList.remove("show");
        }
    };

    video7.onended = () => {
        video7.isFadingOut = false;
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
                            if (bgm3 && !isMobile) fadeAudio(bgm3, 0, 3000);

                            setTimeout(() => {
                                safePause(bgm3);
                                if (outroScreen) outroScreen.classList.remove("show");
                                runFinalOutro();
                            }, 3100);

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
// 8. MOVIE CREDITS
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