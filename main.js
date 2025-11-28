kaboom({ debug: true, background: [0, 0, 0] });

loadSound("bgm", "./sprites/Audios/bgaudio.mp3");
loadSound("score", "./sprites/Audios/coin.mp3");
loadSound("gameover", "./sprites/Audios/game-over.mp3");
loadSound("win", "./sprites/Audios/win.mp3");

loadSprite("jump", "./sprites/player/Jump.png", {
    sliceX: 1,
    anims: {
        jump: { from: 0, to: 0, speed: 10, loop: false },
    },
});
loadSprite("idle", "./sprites/player/Idle.png", {
    sliceX: 11,
    anims: {
        idle: { from: 0, to: 10, speed: 10, loop: true },
    },
});
loadSprite("run", "./sprites/player/Run.png", {
    sliceX: 12,
    anims: {
        run: { from: 0, to: 11, speed: 10, loop: true },
    },
});
loadSprite("trap", "./sprites/Traps/4.png", {
    sliceX: 7,
    anims: {
        trap: { from: 0, to: 6, speed: 7, loop: true },
    },
});
loadSprite("gem", "./sprites/Objects/Gems/3.png", {
    sliceX: 7,
    anims: {
        gem: { from: 0, to: 6, speed: 10, loop: true },
    },
});
loadSprite("flag", "./sprites/Objects/Checkpoints/Checkpoint_Flag_Idle2.png", {
    sliceX: 7,
    anims: {
        flag: { from: 0, to: 6, speed: 10, loop: true },
    },
});

loadSprite("box", "./sprites/Objects/Boxes/1_Idle.png");
loadSprite("bg", "./sprites/Backgrounds/bg.png");
loadSprite("land", "./sprites/Backgrounds/land.png");
loadSprite("ground", "./sprites/Objects/ground.png");

let musicStarted = false;
let score = 0;
let bgm = null;

scene("game", () => {
    setGravity(1600);
    onKeyPress(() => {
        if (!bgm) {
            bgm = play("bgm", { loop: true, volume: 0.1 });
        }
    });
    add([
        sprite("bg"),
        pos(0, 0),
        scale(width() / 512, height() / 316),
        z(-1),
        anchor("topleft"),
    ]);

    const ground = add([
        sprite("land"),
        pos(0, height() - 40),
        scale(width() / 600, 1),
        area(),
        body({ isStatic: true }),
        z(3),
        anchor("topleft"),
    ]);
    function groundSpawn(posx, posy, w, h) {
        let ground = add([
            rect(w || width(), h || 38),
            pos(posx || width() / 2, posy || height() - 24),
            color(0, 0, 0),
            area(),
            z(3),
            body({ isStatic: true }),
        ]);
        return ground;
    }

    function spawnTrap(posx, posy) {
        let trap = add([
            sprite("trap"),
            pos(posx || width() / 2, posy || height() - 90),
            scale(1, 1),
            area({ shape: new Rect(vec2(15, 35), 15, 20) }),
            body({
                isStatic: true,
            }),
            "trap",
        ]);
        trap.play("trap");
        return trap;
    }

    function gemSpawn(posx, posy) {
        let gem = add([
            sprite("gem"),
            pos(posx || width() / 2, posy || height() - 90),
            scale(1.5),
            area(),
            "gem",
        ]);
        gem.play("gem");
        return gem;
    }

    function spawnBox(posx, posy) {
        let box = add([
            sprite("box"),
            pos(posx || width() / 2, posy || height() - 90),
            scale(1.5),
            area(),
            body({
                isStatic: true,
            }),
            "box",
        ]);
        return box;
    }

    add([
        sprite("ground"),
        pos(1, height() - 224),
        area(),
        body({ isStatic: true }),
        scale(1, 1),
    ]);

    add([
        sprite("ground"),
        pos(500, height() - 424),
        area(),
        body({ isStatic: true }),
        scale(1, 1),
    ]);

    add([
        sprite("ground"),
        pos(width() - 130, height() - 324),
        area(),
        body({ isStatic: true }),
        scale(1, 1),
    ]);

    spawnTrap(300, height() - 90);
    spawnTrap(500, height() - 90);
    spawnTrap(700, height() - 90);
    spawnTrap(900, height() - 90);
    spawnTrap(1100, height() - 90);
    spawnTrap(1300, height() - 90);
    spawnBox(400, height() - 150);
    spawnBox(600, height() - 150);
    spawnBox(800, height() - 150);
    spawnBox(100, height() - 380);
    spawnBox(280, height() - 520);
    spawnBox(900, height() - 420);
    spawnBox(1150, height() - 250);
    gemSpawn(400, height() - 190);
    gemSpawn(600, height() - 190);
    gemSpawn(800, height() - 190);
    gemSpawn(10, height() - 270);
    gemSpawn(100, height() - 270);
    gemSpawn(200, height() - 270);
    gemSpawn(500, height() - 480);
    gemSpawn(600, height() - 480);
    gemSpawn(700, height() - 480);

    let player = add([
        sprite("idle"),
        pos(0, height() - 100),
        scale(1.5),
        area(),
        body(),
    ]);

    player.play("idle");

    add([sprite("gem"), pos(12, 12), scale(2)]);

    let scoreLabel = add([text(score), pos(50, 12), color(0, 0, 0), z(3)]);
    scoreLabel.onUpdate(() => {
        scoreLabel.text = score;
    });

    let flag = add([
        sprite("flag"),
        pos(width() - 70, height() - 380),
        scale(1.2),
        area(),
        body({
            isStatic: true,
        }),
        "flag",
    ]);
    flag.play("flag");

    onKeyPress("space", () => {
        if (player.isGrounded()) {
            player.jump(800);
            player.use(sprite("jump"));
            player.play("jump");
        }
    });

    onKeyDown("right", () => {
        player.move(250, 0);
        if (
            player.isGrounded() &&
            (player.sprite !== "run" || player.curAnim() !== "run")
        ) {
            player.use(sprite("run"));
            player.play("run");
        }
    });

    onKeyDown("left", () => {
        player.move(-250, 0);
        if (
            player.isGrounded() &&
            (player.sprite !== "run" || player.curAnim() !== "run")
        ) {
            player.use(sprite("run"));
            player.play("run");
        }
    });

    onUpdate(() => {
        if (
            player.isGrounded() &&
            !isKeyDown("left") &&
            !isKeyDown("right") &&
            player.sprite !== "idle"
        ) {
            player.use(sprite("idle"));
            player.play("idle");
        }
    });
    player.onCollide("trap", () => {
        shake(5);
        addKaboom(player.pos);
        play("gameover");
        player.destroy();
        if (bgm && typeof bgm.stop === "function") {
            bgm.stop();
            bgm = null;
        }

        musicStarted = false;
        wait(1, () => {
            go("lose");
        });
    });

    player.onCollide("gem", (gem) => {
        gem.destroy();
        play("score");
        score++;
    });
    player.onCollide("flag", () => {
        stop();
        play("win");
        go("win");
    });
});

scene("lose", () => {
    add([text("Game Over"), pos(center()), anchor("center"), scale(2)]);

    onKeyPress(() => {
        go("game");
        score = 0;
    });
});

scene("win", () => {
    add([text("You Win!"), pos(center()), anchor("center")]);

    onKeyPress(() => {
        go("game");
        score = 0;
    });
});
go("game");
