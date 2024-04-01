import { useEffect, useRef } from "react";

//https://www.basedash.com/blog/how-to-add-a-csv-file-to-an-array-in-javascript
const CsvFileParser = (props: { setResult: Function }) => {
  const fileInputRef = useRef<any>();
  const reader = new FileReader();

  reader.onload = (event: any) => {
    const text = event.target.result;
    processData(text);
  };

  function processData(csvData: any) {
    //this shit has problem with empty values, so we need to make this thingy to make it work properly
    csvData = csvData.replaceAll(",,", ',"",');
    const lines = csvData.split(/\r\n|\n|\r/);
    const result = [];

    const headers = parseCSVLine(lines[0]);

    for (let i = 1; i < lines.length; i++) {
      //omit last empty line if it happens to be present in the csv
      if (lines[i] === "") {
        continue;
      }
      const obj: { [index: string]: any } = {};
      const currentline = parseCSVLine(lines[i]);

      headers.forEach((header: any, index: any) => {
        obj[header] = currentline[index];
      });

      result.push(obj);
    }

    console.log(result);
    props.setResult(result);
  }

  function parseCSVLine(line: any) {
    const pattern = new RegExp('(\\s*"[^"]+"\\s*)|(\\s*[^,]+\\s*)', "g"); // RegExp to split the line with comma but not within quotes.
    return line.match(pattern).map((value: any) => {
      if (value.startsWith('"') && value.endsWith('"')) {
        return value.substr(1, value.length - 2);
      }
      return value;
    });
  }

  useEffect(() => {
    fileInputRef.current?.addEventListener("change", () => {
      if (fileInputRef.current?.files && fileInputRef.current?.files[0]) {
        const file = fileInputRef.current?.files![0];
        reader.readAsText(file!);
      }
    });
  }, []);

  const parseCsvFromFileInput = () => {
    return null;
  };

  return <input ref={fileInputRef} type="file" />;
};

export default CsvFileParser;
