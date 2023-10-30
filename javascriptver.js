const ARR_ROWS = 10;
const ARR_COLS = 15;

const RECT_WIDTH = 32;
const RECT_HEIGHT = 32;
var grid;

var nikiUp;
var nikiLeft;
var nikiDown;
var nikiRight;

var nikiCol = 0;
var nikiRow = 0;
var nikiDirection = 0;

function drawNiki(){
    switch(nikiDirection % 4){
      case 0:
        image(nikiUp, nikiCol * RECT_WIDTH, nikiRow * RECT_HEIGHT);
        break;
      case 1:
        image(nikiLeft, nikiCol * RECT_WIDTH, nikiRow * RECT_HEIGHT);
        break;
      case 2:
        image(nikiDown, nikiCol * RECT_WIDTH, nikiRow * RECT_HEIGHT);
        break;
      case 3:
        image(nikiRight, nikiCol * RECT_WIDTH, nikiRow * RECT_HEIGHT);
        break;
    }
}

class gridSquare {
  constructor(numOfBalls, topWall, rightWall, bottomWall, leftWall){
    this.numOfBalls = numOfBalls; 
    this.topWall = topWall; 
    this.rightWall = rightWall; 
    this.bottomWall = bottomWall;
    this.leftWall = leftWall;
  }
}

function createGrid(){
  grid = new Array(ARR_COLS);
  for(let i = 0; i < ARR_COLS; i++){
    grid[i] = new Array(ARR_ROWS);
  }
  
  for (let i = 0; i < ARR_COLS; i++) {
    for (let j = 0; j < ARR_ROWS; j++){
      grid[i][j] = new gridSquare(false, 0, false, false, false, false);   
    }
  }
  
}

function drawGrid(){
  for (let i = 0; i < ARR_COLS; i++) {
    for (let j = 0; j < ARR_ROWS; j++){
      rect(i * RECT_WIDTH, j * RECT_HEIGHT, RECT_WIDTH, RECT_HEIGHT);
      
      if(grid[i][j].numOfBalls > 0){
        for(let n = 0; n < grid[i][j].numOfBalls; n++){
          circle(i * RECT_WIDTH + ((n + 1) % 3) * 9 + 7, 
                 j * RECT_HEIGHT + RECT_HEIGHT - (Math.floor(n / 3) + 1) * 9 + 3, 
                 5);
        }
      }
    }
  }
  
  drawNiki();
}

function loadNikis(){
  nikiUp = loadImage("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAABEZJREFUWEfNl19sk2UUxn/v+7W0Hc45NtzWsYGIG0OJCTFqzIJ/IjJGcToMjguGUYwIFyhzirvRGyImbpKgMUIMu3ARMRlT/hpNjBocRFgihjAmizITYAKbyGi7rt97zPe5wTBubccInoumTc573qfnOed5vk9xg0Pd4PsZE4DsQFDyI6c5lZbH2fCpMdUY+uNjOmzbIjn+ArpjXVhKj6nGtQEQI1lpQXounULr6wwgM5AryoBSYFDoQejG/Tb0CaJAK0NPuDuljoya7Mu9V7LnV0F/hAOf1CFw1dA4v4dHdkz4Mqp4MsOBm1yMmDjRmyGTquroRzNv6WNcKJmNeGwMHreywUZhISIuKC2GNLHo8xgO3VHAuUhywzkigJs8GZK5tI44ioefKWdbdci9bLQQ8bLw4HEOFo8DAKcDActHXGme2P0NjdULsQys+P4o3731Ae17Nrl9eH3/EU70Rvlq1Uv0/n6Q8h86aC0uoDd6OikaRkzKyCySVevfZPPaGha17KXxuRCQxtR5z3Ji61q8+cUoDLcvWs0v79diLMGaUkRZazuHiwqIobgQTUzDiADSM2bI7LkLOPb1p1Tu+paPli8APEx59EVOblmDNW06ShR3la/mpw9rUWoAVTCTstYO2ooKiOLjr+hvCbswYsKkQFCUGIyCis/20biyEkRjicHWBpzhc0fin91wltJG8/iBDvYXFXL+WimY6M2U7Ko3iOg46Wc6mbNpI80PzkbEpvpAO914XG3YV1oCAwPubIYOdTAQ1/xYEuRc5BpnwCmYt6xBbKXxdx7GTJuFEcsdPGcV9eBCGB1HGw+KuEtR+PMGelPwh4Qc/dfaZUzIEaUddVT0Rs6MqUbSXpDjzXe7gHIUQVzGnSievwStoX3vdndOnIF05DhZ7pMGEKyud2hnoLme0p87sbXHHT6NwUIRE1Ba8BjBaEPL9LSUOpIwObj8bTG2Jty8kYeOHOOLGTdfPjPZlytn+69QUNYVk32FExLWHE5rwuT86g1iG4vIjncJtbXRVJzrnnEuHyo0BCJ0MiK7pgYS1kwJQGH1OxIzQri5gcq2Dhpnpqvhlw8HsfDXftl9m298AWT588T3VA19LfVMrniZzqZXR6SgvCsme8abgix/rviW1HBxRwOZVevo2rJmFAD9sqdw3DvwPwbwb5Eq77pOHfAvqSG8vYH0ZetcrRfHBLTCLwPExOP6g1dp7q57gZ0zxnkNswN5YmNjCcSVIz02Mvho6iig44SihAm2QbRFTzg5E0paCYcSM/15Mmt+Be17WzgfuyI+80IrZU7ZXLa+UsMfSVpwSjowlJzlv1WMpei9dPVjt7OmG5re4/nFi1Pa/5Q7cEsgT+5cVMXRndv4c5jX31daKfc/XcHHta9xPpq6MyaN2vvACnlk22b6ULQXBS+73qRQndyzeT0XbZvjJVPo6UsNRNIAknvNSD3rbzBEyDCHNRnCAAAAAElFTkSuQmCC");
  
  nikiLeft = loadImage("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAABElJREFUWEfFl11sFGUUhp/vm112t1hraZF2SwsithQlJsS/GII/ESnt1moxWC4oRjEiXKBUFHujN0RMpJKgMZYYegGxYlKqQMFoYtQgEKGJGEIpNEpN+BHaipTd7XbnO2YGqiWy7G4p4VxsdpLznXnnvO8574ziJoe6yfdnRAByA0EpiJziZEY+Z8MnR1Rj6MFHdNi2RSb4CzkT68ZSekQ1rg+AGMnJCNJ78SRa32AA2YE8UQaUAoNCX4Zu3H9DvyAKtDL0hs+k1ZFrJvvyHpDcuTUwEGHfZ/UIXCEa53p45MaEr6OKZ7IcuKlFwsSx3iwZV1PPAJo5C5/kfOkMxGNj8LiVDTYKCxFxQWkxZIhFv8dw4K5CzkVSE2dCALd4siR7YT1xFI89X05zbci92bVCxEvF/qPsLxkFAE4HApaPuNI8vfM7mmorsAws+fEwP7z7MR1tG9w+vLXnEMf7onyz7FX6/thP+U+d7C0ppC96KiUaEiZlZRfLsjXv0LiyjsrWXTS9GAIymDTnBY5vWom3oASF4c7K5Rz7aBXGEqyJxZTt7eBgcSExFOejyWlICCAza6rMmD2PI99+TvWO7/l08TzAw8QnXuHExhVYk6egRHFP+XJ++WQVSg2iCqdRtreT9uJCovj4O/p70i4kTBgXCIoSg1FQ9cVumpZWg2gsMdjagCM+VxKXZsMZShvNU/s62VNcRM/1UjDWmy25NW8T0XEyT3cxc8N6Wh6ZgYhN7b4OzuBxd8PuWaUwOOhqM3Sgk8G45ufSIOci16kBp2D+ogaxlcbfdRAzeTpGLFd4zijqywNhdBxtPCjiLkXhLxvoS8MfknJ0tbHLGjNBlHa2o6IvcnpENVL2ggneArcLKGcjiMu4EyVzF6A1dOza6urEEaSzjlPlPmUAwdp1Du0Mtqxj1q9d2Nrjik9jsFDEBJQWPEYw2tA6JSOtjiRNDi5+T4ytCbes59FDR/hq6q0Jz5R1x2R30ZikNYfTmjS5oHat2MYisu0DQu3tbCnJu+LMeF+enB24pIPQiYjsmBRIWjMtAEW170vMCOGWBqrbO2malvk/AE5BB0TFbwOy8w7f6ALI8eeL79k6+lvXMb7qNbq2vKGcp77adNx/rJu20aYgx58nvgV1XNjWQHbNaro3rkjYgfLuAWkrGvUOJAcwpIGbAmA4FTcMgH9BHeGtDWQuWu3uenFMQCv8MkhMPK4/eJXm3vqX2T51lMcwN5AvNjaWQFw5q8dGLr+aOhvQcUJRwhjbINqiN5yaCaW8CYcSs/35Mn1uFR27WumJ/bf/54SWysyy2Wx6vY4/U7TgtPbAUHKO/3YxlqLv4pWv3c6Yrt3yIS/Nn5/W/KfdgdsC+XJ3ZQ2Htzfz1zCvf3BWtTz0XBWbV71JTzR9Z0wZtffhJfJ4cyP9KDqKg/+63rhQvdzXuIYLts3R0on09qcHImUAqX1mpJ/1D61lwDByIQvWAAAAAElFTkSuQmCC");
  
  nikiDown = loadImage("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAABExJREFUWEfFl19sU3UUxz+/321pO5xzbMjasYGIG0OJCTFqDME/ERmjOB0GxwPDKEaEB5SJ4l70hYiJTBI0RohhDy5MTMYU2DCaGDUIRFgihjAmizIT/ghsIqPtut7fMffKYKil7RhyHpo2Ob/z+/Sc7znnXsUNNnWD72dYAPmBkBRGT3A8K8jpyPFhxRj848M6bNsi4/xFnIp3Yyk9rBjXBiBG8rJC9Fw4jtbXGSA3UCDKgFJgUOiL6Mb9NvgJokArQ0/kVEYZuaqzr+BeyZ9dDf1R9m6pQ+AK0Ti/h1p+XPgipngyx8FNz5I6jvbmyJjqOvrRzFr4GOfKpiEeG4PHjWywUViIiAulxZAlFn0ew/47ijgTTU+cSQFu8uRI7sI6EigefqaCppqwe9nVTMTL3H1H2Fc6AgBOBgKWj4TSPLHzaxpq5mIZWPLdIb596wM6Wje4eXh990GO9sb4ctlL9P62j4rvO9lTWkRv7ERaZUjqlJNbIsvWvMnGlbXMa2mj4bkwkMWEWc9ydPNKvIWlKAy3z1vOz++vwliCNb6E8j0dHCgpIo7iXCx1GZICZOdMlmkz53D4q0+o2vENHy2eA3gY/+iLHNu0AmviJJQo7qpYzo8frkKpAVTRFMr3dNJeUkQMH3/Gfk2ZhaQOYwIhUWIwCio/3UXD0ioQjSUGWxtwxOdK4u/ecJrSRvP43k52lxRz9lpLMNqbK/nVbxDVCbJPdjF9w3qaH5yGiE3N3g5O4XFnw64ZZTAw4GozvL+TgYTmh7IQZ6LXqAEnYHBRvdhK4+86gJk4FSOWKzynFfXFhjA6gTYeFAm3RJHP6unNYD+krNF/tV3OqHGitDMdFb3Rk8OKkfYuGOctdLOAciaCuBV3rHT2ArSGjratrk4cQTrjON3apw0QqlnnlJ2B5nXM+KkLW3tc8WkMFoq4gNKCxwhGG1omZWWUkZTOocVvi7E1keb1PHTwMJ9PvjnpmfLuuOwqHpUy5tCypnQurFkrtrGIbnuXcHs7jaUFl86M9RXI6f7LGggfi8qOCYGUMTMCKK55R+JGiDTXU9XeScOU7KQAc3/pl523+UYWIM8fFN9TtfS1rGNs5ct0Nb6aFKCiOy6tI12CPH+B+BbUcn5bPbnVq+netEI5qf9nezqlqOjul9biEc/AvwGcy4dCDOrgfwUYhBgqwusG4F9QS2RrPdmLVruzXpwloBV+GSAuHnc/eJXm7roX2D55hNswPxAUGxtLIKGc0WMjFx9NnQnobEJRwijbINqiJ5LeEkp7Eg465vqDMnV2JR1tLZyNX+79WeGlMr18JptfqeX3NFdwRnNg0DnPf6sYS9F74crHbqdN1za+x/Pz52fU/xln4JZAUO6cV82h7U38MWTX3zejSu5/upKPV73G2VjmmzFtau8DS+SRpo30oegoCV3aemPCdXLPxjWct22OlI2npy8ziLQB0nvNyNzrLxeQyDCoXNsKAAAAAElFTkSuQmCC");
  
  nikiRight = loadImage("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAABElJREFUWEfFl1tsVFUUhr+9zwwzU6y1tEg7vYBYW4oSE2LUGIKXiJQyWC2mlgeKUYwIDyiViH3RFyImUknQGCGGPkhANKXKpTWaGDVIG6GJGEKpEKUmXARagTIznc7Zy5wjVVCGmWmLrIfJTLL22v+s/1/rP0dxg0Pd4PsZFoDcQFAKIic4npHP6fDxYdUY+uPDOmzbIhP8RZyK9WApPawaIwMgRnIygvRePI7W1xlAdiBPlAGlwKDQl6Ab99vQJ4gCrQy94VNpdeSayb68eyV3di0MRGjf0oDAFaJxfl8euTHhi6jiySwHbmqRMHGsN0vG1TYwgGbWgsc4Vz4N8dgYPG5lg43CQkRcUFoMGWLR7zHsu6OIM5HUxJkQwE2eLMle0EAcxcPPVLK1LuRedq0Q8TK34zAdZaMAwOlAwPIRV5ondn1NU91cLAOLvzvIt2++T9fu9W4fXttzgCN9Ub5c+hJ9v3VQ+X03e8uK6IueSImGhElZ2aWydPUbbFhRz7yWVpqeCwEZTJz1LEc2rcBbUIbCcPu8Zfz83kqMJViFpVTs7WJ/aRExFOeiyWlICCAzq0SmzZzDoa8+pnrnN3y4aA7gofDRFzm2cTnWpMkoUdxVuYwfP1iJUoOooilU7O2ms7SIKD7OR39N2oWECeMCQVFiMAqqPmmjaUk1iMYSg60NOOJzJfHXbDhDaaN5vL2bPaXFnB0pBWO92ZJb+zoRHSfz5FGmr19H84PTELGpa+/iFB53N7TNKIfBQVeboX3dDMY1P5QHORMZoQacgvkLG8VWGv/R/ZhJUzFiucJzRlFfGgij42jjQRF3KQp/1khfGv6QlKOrjV3WmAmitLMdFX2Rk8OqkbIXTPAWuF1AORtBXMadKJtdg9bQ1brN1YkjSGcdp8p9ygCCdWsd2hlsXsuMn45ia48rPo3BQhETUFrwGMFoQ8vkjLQ6kjQ5uOgtMbYm3LyOhw4c4vOSmxOeqeiJSVvxmKQ1L6c1aXJB3RqxjUVk+zuEOjvZXJbnnhnvy5PTA1fyHzoWkZ0TA0lrpgWguO5tiRkh3NxIdWc3TVMylXO5U+TfAOb+MiC7bvONLoAcf774nqqnv2Ut46te5vynjVf1IwdMZU9Mdo82BTn+PPHV1HNheyPZtavo2bg8YQcqewZkd/God+C/ABJp4H8FcDUerhsAf0094W2NZC5c5e56cUxAK/wySEw8rj94lebuhhfYUTLKY5gbyBcbG0sgrpzVYyOXHk2dDeg4oShhjG0QbdEbTs2EUt6EQ4nZ/nyZOruKrtYWzsb+mf9ZoSUyvWImm16p5/cULTitPTCUnOO/VYyl6Lt45WO3M6ZrNr/L8/PnpzX/aXfglkC+3DmvloM7tvLHZV5/34xquf/pKj5a+Spno+k7Y8qovQ8slke2bqAfRVdp8G/XGxdqkHs2rOaCbXO4vJDe/vRApAwgtdeM9LP+BPlVwzC3cxZiAAAAAElFTkSuQmCC");
  
}

function setup() {
  createCanvas(512, 512);
  loadNikis();
  
  createGrid();
  
  grid[1][0].numOfBalls = 9;
}

function draw() {
  background(220);
  strokeWeight(1);
  stroke(0);
  
  drawGrid();
}
