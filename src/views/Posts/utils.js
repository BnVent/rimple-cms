const importMarkdownFile = () =>
  new Promise((resolve) => {
    const filePicker = document.createElement("input");
    const fileReader = new FileReader();

    filePicker.type = "file";
    filePicker.style.visibility = "hidden";
    document.body.appendChild(filePicker);
    filePicker.click();

    filePicker.onchange = (event) => {
      const file = event.target.files[0];
      fileReader.readAsText(file);
    };

    fileReader.addEventListener("load", (event) => {
      resolve(event.target.result);
    });
  });

const getFormattedDateNow = () => {
  const dateNow = new Date();

  const year = dateNow.getFullYear();
  const month = dateNow.getMonth();
  const day = dateNow.getDate();
  const hours = dateNow.getHours();
  const minutes = dateNow.getMinutes();

  const formatWithZero = (value) => (value >= 10 ? value : "0" + value);

  const formattedDate = `${year}-${formatWithZero(month + 1)}-${formatWithZero(day)}T${formatWithZero(hours)}:${formatWithZero(
    minutes
  )}`;
  return formattedDate;
};

export {
  importMarkdownFile,
  getFormattedDateNow,
};
