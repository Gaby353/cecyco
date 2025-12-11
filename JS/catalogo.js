function openModal(title, text) {
document.getElementById('modal-title').innerText = title;
document.getElementById('modal-text').innerText = text;
document.getElementById('modal').style.display = 'flex';
}
function closeModal() {
document.getElementById('modal').style.display = 'none';
}