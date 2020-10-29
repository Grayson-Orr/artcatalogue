<template>
  <div id="app">
    <div class="nav-bar"></div>
    <router-view />
  </div>
</template>

<style lang="scss">
#app {
  font-family: 'Open Sans', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: hsl(0, 0%, 10%);
  font-size: 1.2em;
}

body {
  margin: 0 10px 0 10px;
}

.link {
  color: rgb(48, 124, 172);
  text-decoration: underline;
  cursor: pointer;
}

.nav-bar {
  padding: 10px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

hr {
  width: 30vw;
  text-align: left;
  margin: 20px 0;
}

input[type='text'],
input[type='number'],
select {
  font-size: 0.7em;
  padding: 12px;
  border-radius: none;
  border: 1px solid hsl(0, 0%, 82%);
  box-shadow: inset 2px 2px 5px hsl(0, 0%, 92%);
  &:focus {
    border: 1px solid #1daeea;
  }
}

input[type='submit'],
input[type='button'] {
  cursor: pointer;
  padding: 12px;
  background: #67a3c2;
  border: none;
  border-radius: 4px;
  color: #ffffff;
  transition: background 200ms;
  &:hover {
    background: #377c9e;
  }
  &:disabled {
    color: rgb(190, 190, 190);
    background: linear-gradient(120deg, rgb(139, 139, 139), rgb(148, 147, 147));
  }
}

input,
select {
  &:focus {
    outline-width: 0;
  }
}

label {
  display: block;
  margin: 15px 0;
  &.little-label {
    display: inline;
    font-size: 0.75em;
    margin: 0 5px;
  }
}

h1,
h2,
h3 {
  font-weight: normal;
}
</style>
