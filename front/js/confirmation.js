
const url = window.location.href;
const urlObject = new URL(url);
const orderId = urlObject.searchParams.get("orderId");

document.getElementById("orderId").textContent = orderId;

