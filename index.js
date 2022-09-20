const ji = require("join-images");
const request = require("request");
const argv = require("minimist")(process.argv.slice(2));

// parsing arguments
const {
  greeting = "Hello",
  who = "You",
  width = 400,
  height = 500,
  color = "Pink",
  size = 100,
} = argv;

// first request to cataas
const firstReq = {
  url:
    "https://cataas.com/cat/says/" +
    greeting +
    "?width=" +
    width +
    "&height=" +
    height +
    "&color" +
    color +
    "&s=" +
    size,
  encoding: "binary",
};

// second request to cataas
const secondReq = {
  url:
    "https://cataas.com/cat/says/" +
    who +
    "?width=" +
    width +
    "&height=" +
    height +
    "&color" +
    color +
    "&s=" +
    size,
  encoding: "binary",
};

// getting the first image from cataas
request.get(firstReq, (err, res, firstBody) => {
  if (err) {
    console.log(err);
    return;
  }

  console.log("Received response with status:" + res.statusCode);

  //   getting the second image from cataas
  request.get(secondReq, (err, res, secondBody) => {
    if (err) {
      console.log(err);
      return;
    }

    console.log("Received response with status:" + res.statusCode);

    // joining the recieved images together.
    ji.joinImages([
      { src: Buffer.from(firstBody, "binary"), offsetX: 0, offsetY: 0 },
      { src: Buffer.from(secondBody, "binary"), offsetX: width, offsetY: 0 },
    ])
      // saving the joined image to an output file
      .then((img) => {
        img
          .toFile("cat-card.jpg")
          .then(() => console.log("The file is saved"))
          //   catching any error occured while saving the output image
          .catch((err) =>
            console.log(
              "An error occured while saving the output image - ",
              err
            )
          );
      })
      //   catching any error occured while joining the two images
      .catch((err) =>
        console.log("An error occured while joining the files - ", err)
      );
  });
});
