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

// Elements Video Chapter 2
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
// 1. SỰ KIỆN LẮNG NGHE PHÍM ENTER
// ==========================================
window.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" || started) return;
    started = true;

    // Unlock audio loop trên trình duyệt
    if (projectorLoop) {
        projectorLoop.play().then(() => {
            projectorLoop.pause();
            projectorLoop.currentTime = 0;
        }).catch(err => console.log("Unlock audio err:", err));
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

                // --- ĐẾM ĐẾN "2" -> CHUYỂN SANG BACKGROUND1.JPG ---
                if (numbers[i] === "2") {
                    document.body.classList.add("bg-movie");
                }
            } else {
                clearInterval(timer);

                // --- HẾT COUNTDOWN (Vẫn giữ background1.jpg) ---
                setTimeout(() => {
                    if (countdown) countdown.classList.remove("show");

                    setTimeout(() => {
                        if (projectorStart) {
                            projectorStart.play();

                            projectorStart.onended = () => {
                                if (projectorLoop) {
                                    projectorLoop.volume = 1;
                                    projectorLoop.play().catch(e => console.log("Lỗi loop:", e));
                                }

                                // Fade in "HÀNH TRÌNH THANH XUÂN" trên nền background1.jpg
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
                                        // --- CHUYỂN SANG BACKGROUND2.JPG VÀ HIỆN CHAPTER 1 ---
                                        document.body.classList.remove("bg-movie");
                                        document.body.classList.add("bg-chapter1");

                                        setTimeout(() => {
                                            // Fade in "CHAPTER 1" trên nền background2.jpg
                                            if (chapter1) {
                                                chapter1.classList.remove("hide");
                                                chapter1.classList.add("show");
                                            }

                                            setTimeout(() => {
                                                if (chapter1) {
                                                    chapter1.classList.remove("show");
                                                    chapter1.classList.add("hide");
                                                }

                                                // Bắt đầu phát Video 1
                                                setTimeout(() => {
                                                    playVideo1();
                                                }, 1000);

                                            }, 2000); // Giữ Chapter 1 trong 2s
                                        }, 500);
                                    }, 300);
                                }, 2000);
                            };
                        } else {
                            // Nếu không có projectorStart thì vào thẳng playVideo1
                            playVideo1();
                        }
                    }, 500);
                }, 300);
            }
        }, 800);
    }, 1200);
});

// ==========================================
// 2. PHÁT VIDEO 1 & SLIDE ẢNH
// ==========================================
function playVideo1() {
    if (projectorLoop) fadeAudio(projectorLoop, 0, 1500);
    
    if (bgm) {
        bgm.volume = 0;
        bgm.play().then(() => {
            fadeAudio(bgm, 1, 2000);
        }).catch(e => console.log("Lỗi bgm:", e));
    }

    setTimeout(() => {
        if (projectorLoop) {
            projectorLoop.pause();
            projectorLoop.currentTime = 0;
        }

        if (video1) {
            video1.classList.add("show");
            video1.volume = 0.2;
            video1.play();
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

            // Trình chiếu Slide Ảnh
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

            // Phát tiếp Video 2
            setTimeout(() => {
                playVideo2();
            }, 12000);
        };
    }
}

// ==========================================
// 3. PHÁT VIDEO 2 & CHUYỂN CHAPTER 1 -> 2
// ==========================================
function playVideo2() {
    if (!video2) return;
    video2.currentTime = 0;
    video2.classList.add("show");
    video2.volume = video1 ? video1.volume : 0.2;
    video2.play();

    video2.onended = () => {
        video2.classList.remove("show");

        const outroScreen = document.getElementById("outro-screen");
        const outroText = document.getElementById("outro-text");
        const quoteContent = "Và thế là, những mảnh ký ức đẹp nhất của Thanh Xuân đã được lưu giữ lại mãi mãi...";

        // 1. Hiện màn đen Outro
        setTimeout(() => {
            if (outroScreen) outroScreen.classList.add("show");

            setTimeout(() => {
                if (outroText) {
                    outroText.textContent = "";
                    outroText.classList.remove("done");

                    typeWriter(outroText, quoteContent, 70, () => {
                        setTimeout(() => {
                            if (bgm) fadeAudio(bgm, 0, 2500);

                            setTimeout(() => {
                                if (bgm) bgm.pause();

                                if (bgm2) {
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
// 4. LOGIC CHAPTER 2
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
    videoEl.volume = 0;
    videoEl.play().catch(err => {
        console.error("Lỗi phát video Chapter 2:", err);
        if (onEndedCallback) onEndedCallback();
    });

    videoEl.onended = () => {
        videoEl.classList.remove("show");
        if (onEndedCallback) onEndedCallback();
    };
}

// ==========================================
// FIX MƯỢT NHẠC BGM2 TRONG RUNCHAPTER2OUTRO
// ==========================================
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
                
                // 1. Giảm âm lượng bgm2 về 0 từ từ trong 2000ms (2 giây)
                if (bgm2) fadeAudio(bgm2, 0, 2000);

                // 2. Chuyển background sang Chapter 3
                document.body.classList.remove("bg-chapter2");
                document.body.classList.add("bg-chapter3");

                // 3. Đợi đúng 2.1 giây cho nhạc nhỏ hẳn rồi mới pause và sang Chapter 3
                setTimeout(() => {
                    if (outroText) outroText.textContent = "";
                    if (bgm2) {
                        bgm2.pause(); // Dừng hẳn khi âm lượng đã về 0
                        bgm2.currentTime = 0; // Reset về đầu bài
                    }
                    
                    startChapter3(); // Bắt đầu Chapter 3 (Bật bgm3)
                }, 2100);

            }, 5000); // Đợi 5s cho người xem đọc xong câu quote
        });
    }, 1000);
}

// ==========================================
// 5. CÁC HÀM BỔ TRỢ (UTILITIES)
// ==========================================
function fadeAudio(audio, targetVolume, duration) {
    if (!audio) return;
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
// 6. LOGIC CHAPTER 3
// ==========================================
function startChapter3() {
    console.log("Bắt đầu Chapter 3!");

    // Bật nhạc bgm3 tăng âm lượng mượt mà
    if (bgm3) {
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
                    runChapter3Content(); // Chạy nội dung chính Chap 3
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
    
    // Câu nói 1: Sau Intro Chapter 3
    const quote1 = "Cảm ơn em vì đã xuất hiện và cùng anh tạo nên những ký ức tuyệt vời nhất...";

    if (outroText) {
        outroText.textContent = "";
        outroText.classList.remove("done");
    }

    // 1. Hiện câu nói 1
    if (outroScreen) outroScreen.classList.add("show");

    setTimeout(() => {
        typeWriter(outroText, quote1, 75, () => {
            setTimeout(() => {
                // Tắt câu nói 1
                if (outroScreen) outroScreen.classList.remove("show");

                // 2. Phát Video 7 (Video đời thường)
                setTimeout(() => {
                    if (outroText) outroText.textContent = "";
                    playVideo7();
                }, 1200);

            }, 4000); // Đợi 4s để đọc câu nói 1
        });
    }, 1000);
}

function playVideo7() {
    if (!video7) {
        runChapter3Ending();
        return;
    }

    // 1. Reset video & set âm lượng ban đầu
    video7.currentTime = 0;
    video7.volume = 0; // Để 0 để fade audio lên cho mượt
    
    // 2. Hiện video (Fade-in)
    video7.classList.add("show");
    
    video7.play().then(() => {
        // Tăng âm lượng video mượt từ 0 -> 0.4 trong 1.5s
        fadeAudio(video7, 0.4, 1500);
    }).catch(err => console.error("Lỗi phát video7:", err));

    // 3. Xử lý khi video gần kết thúc (Fade-out trước khi tắt)
    video7.ontimeupdate = () => {
        // Khi video còn đúng 1.5s nữa là hết -> Bắt đầu Fade-out dần
        if (video7.duration - video7.currentTime <= 1.5 && !video7.isFadingOut) {
            video7.isFadingOut = true;
            
            // Fade-out hình ảnh và âm lượng video
            video7.classList.remove("show"); // Mờ dần hình
            fadeAudio(video7, 0, 1200);      // Nhỏ dần tiếng
        }
    };

    // 4. Kết thúc hẳn -> Chuyển sang câu nói 2 + To be continued
    video7.onended = () => {
        video7.isFadingOut = false; // Reset cờ
        
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

    // Reset lại nội dung các khung chữ
    if (outroText) {
        outroText.textContent = "";
        outroText.classList.remove("done");
    }
    if (tbcHighlight) {
        tbcHighlight.textContent = "";
    }

    // Chuyển sang nền đen
    document.body.classList.remove("bg-chapter3");
    document.body.classList.remove("bg-movie");

    if (outroScreen) outroScreen.classList.add("show");

    setTimeout(() => {
        typeWriter(outroText, quote2, 75, () => {
            setTimeout(() => {
                if (tbcHighlight) {
                    typeWriter(tbcHighlight, tbcText, 85, () => {
                        setTimeout(() => {
                            if (bgm3) fadeAudio(bgm3, 0, 3000);

                            setTimeout(() => {
                                if (bgm3) bgm3.pause();
                                if (outroScreen) outroScreen.classList.remove("show");

                                // BẮT ĐẦU CHẠY MOVIE CREDITS
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
// 7. OUTRO TOÀN PHIM (MOVIE CREDITS)
// ==========================================
function runFinalOutro() {
    console.log("Bắt đầu Outro toàn phim Duy Hùng!");

    const creditsScreen = document.getElementById("credits-screen");

    if (creditsScreen) {
        // 1. Hiện màn hình đen từ từ
        creditsScreen.classList.add("show");

        // 2. Chờ 600ms (cho màn đen mờ ra hoàn chỉnh) rồi mới bắt đầu trôi chữ
        setTimeout(() => {
            creditsScreen.classList.add("start");
        }, 600);
    }
}