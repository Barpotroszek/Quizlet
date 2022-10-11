const fs = require("fs");

let data = "";

const rs = fs.createReadStream("data.txt", { encoding: "utf-8" }),
  ws = fs.createWriteStream("output.json", { encoding: "utf-8" });

rs.on("data", (d) => (data += d));
rs.on("end", () => {
  let arr = [],
    words = data.split(";"),
    i = 0;
  console.log("words length:", words.length);
  words.forEach((word) => {
    i++;
    const regex = /(?<eng>['\w\s-\(\)]+) - (?<pl>[\s\S\(\)]+)/g;
    let a = regex.exec(word);
    if (!a) {
        console.log(i, word, a)
        return;
    }
    // console.log(a.groups)
    let { eng, pl } = a.groups;
    arr.push({ eng, pl });
  });
  console.log(arr.length, "i:", i);
  // console.log(arr)
  ws.write(JSON.stringify(arr), "utf-8", () => ws.close());
  rs.close();
});
