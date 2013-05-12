/* 
 * General stuff
 */
max = Math.max;
min = Math.min
abs = Math.abs
floor = Math.floor;
ceil = Math.ceil;
round = Math.round;

function sign(a) { return a ? a < 0 ? -1 : 1 : 0; }

function roundDigit(num, digit) { return round(num / digit) * digit; }

function stringIncludes(haystack, needle) { return haystack.indexOf(needle) != -1; }

function preventEvent(event) { if(event && event.preventDefault) event.preventDefault(); }

function getFirst(me) { for(var i in me) return me[i]; }

// Expensive - use only on clearing
function clearAllTimeouts() {
  var id = setTimeout(function() {});
  while(id--) clearTimeout(id);
}

function createDivs(num) {
  var divs = [];
  while(--num) divs.push(document.createElement("div"));
  return divs;
}
function getDiv() { return divs.length > 0 ? divs.pop() : document.createElement("div"); }
function clearDiv(div) {
  var i, style = div.style;
  for(i = style.length - 1; i >= 0; --i) div.style[div.style[i]] = "";
  div.className = div.id = div.innerHTML = "";
  return div;
}

function step(num) {
  unpause();
  upkeep();
  pause();
  if(num > 0) step(num - 1);
}

function fastforward(num) {
  pause();
  function resume() {
    for(i = speed = (num || 1) - 1; i > 0; --i)
      step();
    unpause();
  }
  
  requestAnimationFrame(resume);
}

function specifyTimer(timerin) {
  // Only use if you're not worried about losing the benefits of requestAnimationFrame
  // Also, this kills performance. Works best with smaller windows!
  timer = timerin;
  requestAnimationFrame = function(func) {
    window.setTimeout(func, timer);
  };
}

function changeUnitsize(num) {
  if(!num) return;
  resetUnitsize(num);
  
  function setter(arr) {
    for(i in arr) {
      updateSize(arr[i]);
      updateLocation(arr[i]);
    }
  }
  
  setter(solids);
  setter(characters);
}

// num = 1 by default
// 1 = floor(0->2) = 50% chance
// 2 = floor(0->3) = 67% chance
// 3 = floor(0->4) = 75% chance
function randTrue(num) {
  return Math.floor(getSeed() * ((num || 1) + 1));
  // return Math.floor(Math.random() * ((num || 1) + 1));
}
function randSign(num) {
  return randTrue(num) * 2 - 1;
}
function randBoolJS(num) {
  return Math.floor(Math.random() * 2);
}

function prethingsorter(a,b) {
  if(a.xloc == b.xloc) return b.yloc - a.yloc;
  else return a.xloc - b.xloc;
};

function arrayof(contents, num) {
  var arr = [];
  for(var i=num; i>0; --i)
    arr.push(contents);
  return arr;
}

/*
 * Basic object positioning helper functions
 */
function updateLocation(me) {
  updatePosition(me);
  updateDisplay(me);
}
function updatePosition(me) {
  if(!me.nomove) shiftHoriz(me, me.xvel);
  if(!me.nofall) shiftVert(me, me.yvel);
}
// To do: measure whether rounding improves or hurts performance
function updateDisplay(me) {
  if(!me.element) return;
  // me.style.marginTop = me.top + "px";
  // me.style.marginLeft = me.left + "px";
  me.style.marginTop = round(me.top) + "px";
  me.style.marginLeft = round(me.left) + "px";
}
function updateAllDisplays() {
  for(i in solids) updateDisplay(solids[i]);
  for(i in characters) updateDisplay(characters[i]);
}
function updateSize(me) {
  me.element.style.width =  me.width * unitsize + "px";
  me.element.style.height =  me.height * unitsize + "px";
}
function reduceHeight(me, dy, see) {
  me.top += dy;
  me.height -= dy / unitsize;
  
  if(see) {
    updateSize(me);
    updateDisplay(me);
  }
}
function shiftBoth(me, dx, dy, see) {
  if(!me.noshiftx) shiftHoriz(me, dx);
  if(!me.noshifty) shiftVert(me, dy);
  if(see) updateDisplay(me);
}
function shiftHoriz(me, dx, see) {
  me.left += dx;
  me.right += dx;
  if(see) updateDisplay(me);
}
function shiftVert(me, dy, see) {
  me.top += dy;
  me.bottom += dy;
  if(see) updateDisplay(me);
}
function setLeft(me, left, see) {
  me.left = left;
  me.right = me.left + me.width * unitsize;
  if(see) updateDisplay(me);
}
function setRight(me, right, see) {
  me.right = right;
  me.left = me.right - me.width * unitsize;
  if(see) updateDisplay(me);
}
function setTop(me, top, see) {
  me.top = top;
  me.bottom = me.top + me.height * unitsize;
  if(see) updateDisplay(me);
}
function setBottom(me, bottom, see) {
  me.bottom = bottom;
  me.top = me.bottom - me.height * unitsize;
  if(see) updateDisplay(me);
}
function setSize(me, width, height, see) {
  if(width) me.width = width;
  if(height) me.height = height;
  if(see) updateDisplay(me);
}
function setMidX(me, left, see) {
  setLeft(me, left + me.width * unitsized2, see);
}
function getMidX(me) {
  return me.left + me.width * unitsized2;
}
function setMidY(me, top, see) {
  setTop(me, top + me.height * unitsized2, see);
}
function setMidXObj(me, object, see) {
  setLeft(me, (object.left + object.width * unitsized2) - (me.width * unitsized2), see);
}
function slideToXLoc(me, xloc, maxspeed, see) {
  maxspeed = maxspeed || Infinity;
  var midx = getMidX(me);
  if(midx < xloc) {
    // Me is the left
    shiftHoriz(me, min(maxspeed, (xloc - midx)), see);
  } else {
    // Me is the right
    shiftHoriz(me, max(maxspeed * -1, (xloc - midx)), see);
  }
}
function updateLeft(me, dx, see) {
  me.left += dx;
  me.right = me.left + me.width * unitsize;
  if(see) updateDisplay(me);
}
function updateRight(me, dx, see) {
  me.right += dx;
  me.left = me.right - me.width * unitsize;
  if(see) updateDisplay(me);
}
function updateTop(me, dy, see) {
  me.top += dy;
  me.bottom = me.top + me.height * unitsize;
  if(see) updateDisplay(me);
}
function updateBottom(me, dy, see) {
  me.bottom += dy;
  me.top = me.bottom - me.height * unitsize;
  if(see) updateDisplay(me);
}

/*
 * Collisions
 */
function determineThingCollisions(me) {
  if(me.nocollide) return;
  else if(!me.resting || me.resting.yvel == 0) me.resting = false;
  
  // Cur is each quadrant this object is in, and other is each other object in them.
  var cur, other, contents;
  
  checkOverlap(me);
  
  // For each quadrant the thing is in:
  for(var i = 0, len = me.numquads; i < len; ++i) {
    cur = me.quads[i];
    others = cur.things;
    // For each other thin in that quadrant:
    for(var j = 0, lenj = cur.numthings; j < lenj; ++j) {
      other = others[j];
      // to do: get nocollide working on scenery for performance's sake
      if(me == other) break; // breaking should prevent double collisions
      if(!other.alive || other.scenery || other.nocollide) continue; // not removed in upkeep
      
      // The .hidden check is required. Try the beginning of 2-1 without it.
      if(objectsTouch(me, other) && (me.mario || !other.hidden || solidOnCharacter(other, me))) {
        // Collisions for characters are simple
        if(other.character) {
          // if(charactersTouch(me, other))
            objectsCollided(me, other);
        }
        
        // Collisions for solids, slightly less so (overlaps)
        else if(!me.nocollidesolid) {
          objectsCollided(me, other);
          if(!me.skipoverlaps && !other.skipoverlaps && characterOverlapsSolid(me, other))
            me.overlaps.push(other);
        }
      }
    }
  }
  
  if(me.undermid) me.undermid.bottomBump(me.undermid, me);
  else if(me.under instanceof Thing) me.under.bottomBump(me.under, me);
  
}

// give solid a tag for overlap
// remove tag when overlaps = []
function checkOverlap(me) {
  if(me.overlapdir) {
    if((me.overlapdir < 0 && me.right <= me.ocheck.left + unitsizet2)
        || me.left >= me.ocheck.right - unitsizet2) {
      me.overlapdir = 0;
      me.overlaps = [];
    }
    else shiftHoriz(me, me.overlapdir, true);
  }
  else if(me.overlaps.length > 0) {
    // mid = me.omid is the midpoint of what is being overlapped
    var overlaps = me.overlaps, mid = 0, right = {right: -Infinity}, left = {left: Infinity}, over;
    me.overlapfix = true;
    
    for(i in overlaps) {
      over = overlaps[i];
      mid += getMidX(over);
      if(over.right > right.right) right = over;
      if(over.left < left.left) left = over;
    }
    mid /= overlaps.length;
    if(getMidX(me) >= mid - unitsized16) {
      // To the right of the middle: travel until past right
      me.overlapdir = unitsize;
      me.ocheck = right;
    } else {
      // To the left of the middle: travel until past left
      me.overlapdir = -unitsize;
      me.ocheck = left;
    }
  }
}
function characterOverlapsSolid(me, solid) {
  return me.top <= solid.top && me.bottom > solid.bottom;
}

// Purposefully only looks at toly; horizontal uses 1 unitsize
function objectsTouch(one, two) {
  if(one.right - unitsize > two.left && one.left + unitsize < two.right)
    if(one.bottom >= two.top && one.top <= two.bottom)
      return true;
  return false;
}
// Used to double-check objectsTouch
function charactersTouch(one, two) {
  if(one.bottom <= two.top + unitsizet2 || one.top + unitsizet2 >= two.bottom) return false;
  return true;
}
// No tolerance! Just unitsize.
function objectInQuadrant(one, quad) {
  if(one.right + unitsize >= quad.left && one.left - unitsize <= quad.right)
    if(one.bottom + unitsize >= quad.top && one.top - unitsize <= quad.bottom)
      return true;
  return false;
}

function objectsCollided(one, two) {
  // Assume that if there's a solid, it's two. (solids don't collide with each other)
  if(one.solid) return objectsCollided(two, one);
  
  // Up solids are special
  if(two.up && one != two.up) return characterTouchesUp(one, two);
  
  // Otherwise, regular collisions
  if(two.solid || one.mario) two.collide(one, two);
  else one.collide(two, one);
}

// Sees whether one's midpoint is to the left of two's
function objectToLeft(one, two) {
  return (one.left + one.right) / 2 < (two.left + two.right) / 2;
}
/*
  TO DO: Revamp these
*/
function objectOnTop(one, two) {
  if(one.type == "solid" && two.yvel > 0) return false;
  if(one.yvel < two.yvel && two.type != "solid") return false;
  if(one.mario && one.bottom < two.bottom && two.group == "enemy") return true;
  return(  (one.left + unitsize < two.right && one.right - unitsize > two.left) && 
  (one.bottom - two.yvel <= two.top + two.toly || one.bottom <= two.top + two.toly + Math.abs(one.yvel - two.yvel)));
}
// Like objectOnTop, but more specifically used for characterOnSolid and characterOnRestig
function objectOnSolid(one, two) {
  return(
    ( one.left + unitsize < two.right &&
      one.right - unitsize > two.left )
    && 
    ( one.bottom - one.yvel <= two.top + two.toly || 
      one.bottom <= two.top + two.toly + Math.abs(one.yvel - two.yvel) )
  );
}
function solidOnCharacter(solid, me) {
  if(me.yvel >= 0) return false;
  me.midx = getMidX(me);
  return me.midx > solid.left && me.midx < solid.right && 
  (solid.bottom - solid.yvel <= me.top + me.toly - me.yvel);
}
// This would make the smart koopas stay on the edges more intelligently
// Can't use objectOnTop for this, else Mario will walk on walls.
function characterOnSolid(me, solid) {
  return (me.resting == solid || (objectOnSolid(me, solid) && me.yvel >= 0 &&
    me.left + me.xvel + unitsize != solid.right && me.right - me.xvel - unitsize != solid.left));
    // me.left - me.xvel + unitsize != solid.right && me.right + me.xvel - unitsize != solid.left));
    // me.left - me.xvel + unitsize != solid.right && me.right - me.xvel - unitsize != solid.left));
}
function characterOnResting(me, solid) {
  return objectOnSolid(me, solid) &&
    // me.left - me.xvel + unitsize != solid.right && me.right - me.xvel - unitsize != solid.left;
    me.left + me.xvel + unitsize != solid.right && me.right - me.xvel - unitsize != solid.left;
}

function characterTouchedSolid(me, solid) {
  if(solid.up == me) return;
  
  // Me on top of the solid
  if(characterOnSolid(me, solid)) {
    if(solid.hidden) return;
    me.resting = solid;
  }
  
  // Solid on top of me
  else if(solidOnCharacter(solid, me)) {
    var mid = me.left + me.width * unitsize / 2;
    if(mid > solid.left && mid < solid.right) me.undermid = solid;
    else if(solid.hidden) return;
    if(!me.under) me.under = [solid];
    else me.under.push(solid);
    setTop(me, solid.bottom - me.toly + solid.yvel, true);
    me.yvel = solid.yvel;
    if(me.mario) me.keys.jump = 0;
  }
  
  if(solid.hidden) return;
  
  // Character bumping into the side
  //// .midx is given by solidOnCharacter
  if(!objectOnTop(me, solid) && !objectOnTop(solid, me) && !me.under
   && !(solid.up && me == solid.up)) {
    if(me.right <= solid.right) { // To left of solid
      me.xvel = min(me.xvel, 0);
      shiftHoriz(me, max(solid.left + unitsize - me.right, unitsized2 * -1), true);
    } else if(me.left >= solid.left) { // To right of solid
      me.xvel = max(me.xvel, 0);
      shiftHoriz(me, min(solid.right - unitsize - me.left, unitsized2), true);
    }
    
    if(!me.mario) {
      me.moveleft = !me.moveleft;
      if(me.group == "item") me.collide(solid, me);
    }
    // PipeSide
    else if(solid.actionLeft)
      solid.actionLeft(me, solid, solid.transport);
  }
}

function characterTouchesUp(me, solid) {
  switch(me.group) {
    case "item": 
      me.moveleft = getMidX(me) <= getMidX(solid) + unitsized2;
      characterHops(me);
    break;
    case "coin":
      me.animate(me);
    break;
    default:
      me.death(me, 2);
      scoreEnemyBelow(me);
    break;
  }
}

function characterHops(me) {
  me.yvel = -1.4 * unitsize;
  me.resting = false;
}

function characterIsAlive(me) {
  return !(!me || me.dead || !me.alive || !me.element);
}

/*
 * Scoring on enemies
 */
function scoreEnemyStomp(enemy) {
  var amount = 100;
  switch(enemy.type.split(" ")[0]) {
    case "koopa": 
      if(enemy.fly) amount = 400;
      else amount = 100;
    break;
    case "cheepcheep": amount = 200; break;
    case "hammerbro": amount = 1000; break;
    case "lakitu": amount = 800; break;
    case "bulletbill": amount = 200; break;
    default: amount = 100; break;
  }
  // scoreEnemyFin(enemy, amount);
}
function scoreEnemyFire(enemy) {
  var amount = 200;
  switch(enemy.type.split(" ")[0]) {
    case "goomba": amount = 100; break;
    case "hammerbro": amount = 1000; break;
    case "bowser": amount = 5000; break;
    default: amount = 200; break;
  }
  scoreEnemyFin(enemy, amount);
}
function scoreEnemyStar(enemy) {
  var amount = 200;
  switch(enemy.type.split(" ")[0]) {
    case "goomba": amount = 100; break;
    case "hammerbro": amount = 1000; break;
    default: amount = 200; break;
  }
  scoreEnemyFin(enemy, amount);
  play("Kick.wav");
}
function scoreEnemyBelow(enemy) {
  var amount = 100;
  switch(enemy.type.split(" ")[0]) {
    case "hammerbro": amount = 1000; break;
    default: amount = 100; break;
  }
  scoreEnemyFin(enemy, amount);
}
function scoreEnemyFin(enemy, amount) {
  score(enemy, amount, true);
}

/*
 * General actions
 */

function moveSimple(me) {
  if(me.direction != me.moveleft) {
    if(me.moveleft) {
      me.xvel = -me.speed;
      if(!me.noflip) removeClass(me, "flipped");
    } else {
      if(!me.noflip) addElementClass(me.element, "flipped");
      me.xvel = me.speed; 
    }
    me.direction = me.moveleft;
  }
}

function moveSmart(me) {
  moveSimple(me);
  
  if(me.yvel == 0 && (!me.resting || (offResting(me)))) {
    if(me.moveleft) shiftHoriz(me, unitsize, true);
    else shiftHoriz(me, unitsize * -1, true);
    me.moveleft = !me.moveleft;
  }
}
function offResting(me) {
  if(me.moveleft) return me.right - unitsize < me.resting.left;
  else return me.left + unitsize > me.resting.right;
}

function moveJumping(me) {
  moveSimple(me);
  
  if(me.resting) {
    me.yvel = -Math.abs(me.jumpheight);
    me.resting = false;
  }
}

// Floating: the vertical version
// Example usage on World 1-3
// [moveFloating, 30, 72] slides up and down between 30 and 72
function moveFloating(me) {
  setPlatformEndpoints(me);
  me.begin = map.floor * unitsize - me.begin;
  me.end = map.floor * unitsize - me.end;
  (me.movement = moveFloatingReal)(me);
}
function moveFloatingReal(me) {
  if(me.top < me.end)
    me.yvel = min(me.yvel + unitsized32, me.maxvel);
  else if(me.bottom > me.begin)
    me.yvel = max(me.yvel - unitsized32, -me.maxvel);
  movePlatformNorm(me);
}
// Sliding: the horizontal version
// Example usage on World 3-3
// [moveSliding, 228, 260] slides back and forth between 228 and 260
function moveSliding(me) {
  setPlatformEndpoints(me);
  (me.movement = moveSlidingReal)(me);
}
function moveSlidingReal(me) {
  if(screen.left + me.left < me.begin)
    me.xvel = min(me.xvel + unitsized32, me.maxvel);
  else if(screen.left + me.right > me.end)
    me.xvel = max(me.xvel - unitsized32, -me.maxvel);
  movePlatformNorm(me);
}
// Makes sure begin < end by swapping if not so
function setPlatformEndpoints(me) {
  if(me.begin > me.end) {
    var temp = me.begin;
    me.begin = me.end;
    me.end = temp;
  }
}

function collideTransport(me, solid) {
  characterTouchedSolid(me, solid);
  if(solid != me.resting) return;
  
  solid.movement = movePlatformNorm;
  solid.collide = characterTouchedSolid;
  solid.xvel = unitsized2;
}

// To do: make me.collide and stages w/functions
// To do: split this into .partner and whatnot
function moveFalling(me) {
  if(me != mario.resting) return me.yvel = 0;
  
  // Since Mario is on me, fall
  shiftVert(me, me.yvel += unitsized8);
  setBottom(mario, me.top);
  
  // After a velocity threshold, always fall
  if(me.yvel >= unitsize * 2.8) {
    me.freefall = true;
    me.movement = moveFreeFalling;
  }
}
function moveFallingScale(me) {
  // If Mario is resting on me, fall
  if(mario.resting == me) {
    shiftScaleStringVert(me, me.string, me.yvel += unitsized16);
    shiftScaleStringVert(me.partner, me.partner.string, -me.yvel);
    me.tension += me.yvel;
    me.partner.tension -= me.yvel;
  }
  // Otherwise, if me or partner has a positive yvel, slow it down
  else if(me.yvel > 0) {
    shiftScaleStringVert(me, me.string, me.yvel -= unitsized32);
    shiftScaleStringVert(me.partner, me.partner.string, -me.yvel);
    me.tension -= me.yvel;
    me.partner.tension += me.yvel;
  }
  // If the platform falls off
  if(me.partner.tension <= 0) {
    me.collide = me.partner.collide = characterTouchedSolid;
    // Keep falling at an increasing pace
    me.movement = me.partner.movement = moveFreeFalling;
  }
}
function moveFreeFalling(me) {
  shiftVert(me, me.yvel += unitsized16);
  if(me.yvel > unitsizet2)
    me.movement = function(me) { shiftVert(me, me.yvel); }
}
function shiftScaleStringVert(me, string, yvel) {
  shiftVert(me, yvel);
  string.bottom = me.top;
  string.height = (string.bottom - string.top) / unitsize;
  updateSize(string);
  updateDisplay(string); 
}


function addClass(me, strin) { me.element.className += " " + strin; }
function removeClass(me, strin) { me.element.className = me.element.className.replace(new RegExp(" " + strin,"gm"),''); }
function switchClass(me, str1, str2) { removeClass(me, str1); addClass(me, str2); }
function addElementClass(element, strin) { element.className += " " + strin; }
function removeElementClass(element, strin) { element.className = element.className.replace(new RegExp(" " + strin,"gm"),''); }
function removeClasses(me, strings) {
  var strings, arr, i, j;
  for(i = 1; i < arguments.length; ++i) {
    strings = arguments[i];
    arr = strings instanceof Array ? strings : strings.split(" ");
    for(j = arr.length - 1; j >= 0; --j)
      removeClass(me, arr[j]);
  }
}
function addClasses(me, strings) {
  var arr = strings instanceof Array ? strings : strings.split(" ");
  for(var i = arr.length - 1; i >= 0; --i)
    addClass(me, arr[i]);
}

/*
 * Deaths & removing
 */

// Javascript memory management, you are bad and should feel bad.
function deleteThing(me, array, arrayloc) {
  deleted.push(array.splice(arrayloc,1));
  if(me) removeElement(me);
}
function removeElement(me) {
  if(!me.element) return;
  me.element.style.visibility = "hidden";
  divs.push(clearDiv(me.element));
  body.removeChild(me.element);
  delete me.element;
  if(me.type == "fireball") --mario.numballs; // To do: make this part of fireball
}
function killNormal(me) {
  if(!me || !me.alive) return;
  me.alive = me.resting = me.movement = false;
  removeElement(me);
  clearAllCycles(me);
}
function killFlip(me, extra) {
  addElementClass(me.element, "flip-vert");
  me.bottomBump = function() {};
  me.nocollide = me.dead = true;
  me.resting = me.movement = me.speed = me.xvel = me.nofall = false;
  me.yvel = -unitsize;
  addEvent(function(me) { killNormal(me); }, 70 + (extra || 0));
}

// To do: phase this out in favor of an addEvent-based one
function generalMovement(me, dx, dy, cleartime) {
  var move = setInterval(function() {
    shiftVert(me, dy);
    shiftHoriz(me, dx);
  }, timer);
  setTimeout(function() { clearInterval(move); }, cleartime);
}
function blockBumpMovement(me) {
  var dir = -3, dd = .5;
  // To do: addEventInterval?
  var move = setInterval(function() {
    shiftVert(me, dir);
    dir += dd;
    if(dir == 3.5) {
      clearInterval(move);
      me.up = false;
    }
    determineThingCollisions(me); // for coins
  }, timer);
}

function emergeUp(me, solid) {
  play("Powerup Appears.wav");
  addClass(me, "flipped");
  me.nomove = me.nocollide = me.alive = me.nofall = me.emerging = true;
  determineThingQuadrants(me);
  var move = setInterval(function() {
    shiftVert(me, -unitsized8, true);
    if(me.bottom <= solid.top) {
      clearInterval(move);
      me.nocollide = me.nomove = me.moveleft = me.nofall = me.emerging = false;
      if(me.movement) {
        me.movementsave = me.movement;
        me.movement = moveSimple;
        me.moving = setInterval(function() {
          if(me.resting != solid) {
            clearTimeout(me.moving);
            addEvent(function(me) { me.movement = me.movementsave; }, 1, me);
          }
        }, timer);
      }
    }
  }, timer);
}

// To do: make this use events
function flicker(me, cleartime) {
  me.flickering = true;
  var on = me.element.style.visibility == "visible", timing = timer * 8,
  flick = setInterval(function() {
    if(on) me.element.style.visibility = "hidden";
    else me.element.style.visibility = "visible";
    on = !on;
  }, timing);
  addEvent(function() {
    clearInterval(flick);
    me.element.style.visibility = "visible";
    me.flickering = false;
  }, cleartime);
}

// Kills all characters other than mario
// Used in endCastleOutside/Inside
function killOtherCharacters() {
  for(var i = characters.length - 1; i >= 0; --i)
    if(!characters[i].nokillend)
      deleteThing(characters[i], characters, i);
}

function lookTowardMario(me, big) {
  // Mario is to the left
  if(mario.right <= me.left) {
    if(!me.lookleft || big) {
      me.lookleft = true;
      me.moveleft = false;
      removeClass(me, "flipped");
    }
  }
  // Mario is to the right
  else if(mario.left >= me.right) {
    if(me.lookleft || big) {
      me.lookleft = false;
      me.moveleft = true;
      addClass(me, "flipped");
    }
  }
}
function lookTowardThing(me, thing) {
  // It's to the left
  if(thing.right <= me.left) {
    me.lookleft = true;
    me.moveleft = false;
    removeClass(me, "flipped");
  }
  // It's to the right
  else if(thing.left >= me.right) {
    me.lookleft = false;
    me.moveleft = true;
    addClass(me, "flipped");
  }
}