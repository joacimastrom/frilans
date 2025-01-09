import axios from "axios";

export const getTaxTable = async (fromValue = 55001, toValue = 55100) => {
  const queryParams = `inkomst+fr.o.m=${fromValue}&inkomst+t.o.m=${toValue}`;

  const { data } = await axios.get(
    `https://skatteverket.entryscape.net/rowstore/dataset/88320397-5c32-4c16-ae79-d36d95b17b95?${queryParams}`
  );
  return data;
};
