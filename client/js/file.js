export function readURL() {
  if (this.files && this.files[0]) {
    var reader = new FileReader();

    reader.onload = (e) => {
      document.querySelector("#picture_preview").src = e.target.result;
      console.log(this.files[0]);
    };

    reader.readAsDataURL(this.files[0]);
  }
}
