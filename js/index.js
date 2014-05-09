// Progress Bar
var progressBar;

// Can Animation
var animationA;

// Market Animation
var animationB;

// Screenshot
var currentScreenshot = null;

function ProgressBar(objectCount, onIncrement, onComplete) {
    this.objectCount = objectCount;
    this.loadedObjectCount = 0;
    this.progress = 0;
    this.onIncrement = onIncrement;
    this.onComplete = onComplete;
    this.increment = function() {
        this.loadedObjectCount++;
        this.progress = this.loadedObjectCount / this.objectCount;
        this.onIncrement(this.progress);
        if (this.progress === 1)
            this.onComplete();
    }
}

function Animation(container, path, type, count, onLoad) {
    this.container = container;
    this.count = count;
    this.index = 0;
    this.previousIndex = 0;
    this.timeline = [];

    var frameIndex = 1;
    var progress = 0;
    while (frameIndex <= count) {
        $(container).append('<img>');
        var element = $(container + ' img:nth-child(' + frameIndex + ')');
        var imageFile = path + frameIndex + type;
        if (frameIndex > 1)
            element.addClass('transparent');
        element.load(onLoad).attr('src', imageFile);

        frameIndex++;
    }

    this.gotoFrame = function(i) {
        this.previousIndex = this.index;
        this.index = Math.floor(i);
        if (this.index != this.previousIndex) {
            $(container + ' img:nth-child(' + (this.previousIndex + 1) + ')').toggleClass('transparent');
            $(container + ' img:nth-child(' + (this.index + 1) + ')').toggleClass('transparent');
        }
    };
}

function onTop() {
    $('#main-header').finish();
    TweenMax.to('#main-header', 0.4, {backgroundColor: 'rgba(255, 255, 255, 0)'});
    TweenMax.to('#main-header a', 0.4, {color: 'rgb(255, 255, 255)'});
    TweenMax.to('#logo_dark', 0.4, {opacity: '0'});
    TweenMax.to('#logo', 0.4, {opacity: '1'});
}

function onBottom() {
    $('#screens').css('display', 'block');
    
    TweenMax.to('#screen-menu', 0.4, {x: 0, opacity: 1});
}

function onLeaveTop() {
    TweenMax.to('#main-header', 0.4, {backgroundColor: 'rgba(255, 255, 255, 1)'});
    TweenMax.to('#main-header a', 0.4, {color: 'rgb(0, 0, 0)'});
    TweenMax.to('#logo_dark', 0.4, {opacity: '1'});
    TweenMax.to('#logo', 0.4, {opacity: '0'});
}

function onLeaveBottom() {
    $('#screens').css('display', 'none');
    if ($(window).scrollTop() < 3620) {
        $('body').css('background', '#f3f3f3');
    } else {
        $('body').css('background', '#222');
    }

    TweenMax.to('#screen-menu', 0.4, {x: 100, opacity: 0});
}

function initSkrollrStuff() {
    if ($('#fixed-stuff').css('display') != 'none') {
        var s = skrollr.init({
            beforerender: function(data) {
                var pos = data.curTop;
                
                // closure
                var clamp = function(v, a, b) {
                    if (v < a) {
                        v = a;
                    } else if (v > b) {
                        v = b;
                    }
                    return v;
                }
                
                // closure
                var map = function(v, minA, maxA, minB, maxB) {
                    v = clamp(v, minA, maxA);
                    return ((v - minA) / (maxA - minA)) * (maxB - minB) + minB;
                };
                
                // Can Animation
                if (pos < 1240) {
                    animationA.gotoFrame(map(pos, 0, 620, 0, 15));
                } else if (pos < 2480) {
                    animationA.gotoFrame(map(pos, 1240, 1860, 15, 40));
                } else if (pos < 3620) {
                    animationA.gotoFrame(map(pos, 2480, 3000, 40, 102));
                } else if (pos < 4860) {
                    animationA.gotoFrame(map(pos, 3620, 4240, 103, 116));
                }

                var pos2 = clamp(pos, 3720, 4030);
                animationB.gotoFrame(map(pos2, 3720, 4030, 0, 9));

                if (pos > 0) {
                    onLeaveTop();
                } else {
                    onTop();
                }

                if (pos >= 4240) {
                    onBottom();
                } else {
                    onLeaveBottom();
                }
            }
        });

        // init scroll target
        $('a').click(function() {
            var id = $(this).attr('href');
            switch (id) {
            case '#home':
                s.animateTo(0);
                break;
            case '#about':
                s.animateTo(620);
                break;
            case '#product':
                s.animateTo(2360);
                break;
            case '#app':
                s.animateTo(3000);
                break;
            case '#market':
                s.animateTo(4240);
                break;
            default:
                console.log('unknown id: ' + id);
            }
        })
    }
}

function initOtherStuff() {
    // Loading Screen
    progressBar = new ProgressBar(
            127,
            function(progress) {
                $('#progress p').html("" + Math.round(progress * 100) + "%");
                TweenMax.to('#loading-can-switch', 1, {rotation: '' + (180 * progress), transformOrigin: 'center 75%'});
            },
            function() {
                $('#loading-screen').fadeOut(1000);
            }
    );

    // Animation A
    animationA = new Animation(
            '#animation-a',
            'images/animationA/',
            '.png',
            117,
            function() {
                progressBar.increment();
            }
    );

    // Animation B
    animationB = new Animation(
            '#animation-b',
            'images/animationB/',
            '.png',
            10,
            function() {
                progressBar.increment();
            }
    );
    
    $('#screen-label-1')
        .hover(function() {
            TweenMax.to('#screen-2', 0.4, {backgroundPosition: '0px 0px'});
            $('#screen-2').addClass('layer1');
        }, function() {
            TweenMax.to('#screen-2', 0.4, {backgroundPosition: '-300px 0px'});
            $('#screen-2').removeClass('layer1');
        });
        
        
    $('#screen-label-2')
        .hover(function() {
            TweenMax.to('#screen-3', 0.4, {backgroundPosition: '0px 0px'});
            $('#screen-3').addClass('layer1');
        }, function() {
            TweenMax.to('#screen-3', 0.4, {backgroundPosition: '-300px 0px'});
            $('#screen-3').removeClass('layer1');
        });
        
        
        
    $('#screen-label-3')
        .hover(function() {
            TweenMax.to('#screen-4', 0.4, {backgroundPosition: '0px 0px'});
            $('#screen-4').addClass('layer1');
        }, function() {
            TweenMax.to('#screen-4', 0.4, {backgroundPosition: '-300px 0px'});
            $('#screen-4').removeClass('layer1');
        });
}

function initMediaQueryStuff() {
    $(window).resize(function() {
        // stop skrollr when on mobile UI
        if ($('#fixed-stuff').css('display') == 'none') {
            var s = skrollr.get();
            if (s != undefined) {
                s.destroy();
                console.log('skrollr destroyed');
            }
            
            // Force screen menu go to its original position
            TweenMax.to('#screen-menu', 0.4, {x: 0, opacity: 1});
            TweenMax.killAll(true);
            
        // start skrollr on desktop UI
        } else {
            var s = skrollr.get();
            if (s == undefined) {
                initSkrollrStuff();
                console.log('skrollr initialized');
            }
            
            if (progressBar.progress == 1) {
                $('#loading-screen').fadeOut(1);
            }
        }
    });
}

$(document).ready(function() {
    initOtherStuff();
    initSkrollrStuff();
    initMediaQueryStuff();
});
