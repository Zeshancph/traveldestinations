export function readURL() {
  if (this.files && this.files[0]) {
    var reader = new FileReader();

    reader.onload = function (e) {
      document.querySelector("#picture_preview").src = e.target.result;
    };

    reader.readAsDataURL(this.files[0]);
  }
}
