import { sayHello } from "./greet";

function showHello(divName: string, name: string) {
  const ele = document.getElementById(divName);
  ele.innerHTML = sayHello(name);
}

showHello("greeting", "TypeScript");
