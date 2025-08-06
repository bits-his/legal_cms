// import { useLocation } from "react-router";
export const server_url = 'https://server.brainstorm.ng/legal_cms_backend'
// export const server_url = "http://localhost:34567";
// export const server_url = " http://192.168.1.67:34567";
// export const server_url = "https://server.brainstorm.ng/yazid-academy";
// export const server_url = "https://server.brainstorm.ng/skcooly-api";
// export const server_url = "https://server.brainstorm.ng/elite-api";
// export const server_url = "http://62.72.0.209:53401";
export const short_name =
  window.location.hostname.split(".")[0] === "localhost"
    ? ""
    : window.location.hostname.split(".")[0];

// POST Request
export const _post = (url, data, success = (f) => f, error = (f) => f) => {
  const token = localStorage.getItem("@@auth_token");
  fetch(`${server_url}/${url}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: token,
    },
    body: JSON.stringify(data),
  })
    .then((raw) => raw.json())
    .then((result) => {
      success(result);
    })
    .catch((err) => {
      error(err);
    });
};

export const _asyncPost = async (url, data) => {
  const token = localStorage.getItem("@@auth_token");

  try {
    const response = await fetch(`${server_url}/${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Ensure proper token format
      },
      body: JSON.stringify(data),
    });

    // Check if response is ok (HTTP status 200-299)
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Request failed");
    }

    return await response.json(); // Return parsed JSON
  } catch (error) {
    console.error("API Error:", error);
    throw error; // Ensure calling function can handle it
  }
};

// POST Request for different data formats
export const _postnew = (
  url,
  data,
  success = (f) => f,
  error = (f) => f,
  isJson = true
) => {
  const token = localStorage.getItem("@@auth_token");
  const headers = isJson
    ? {
        "Content-Type": "application/json",
        authorization: `${token}`,
      }
    : {
        authorization: `${token}`,
      };
  const body = isJson ? JSON.stringify(data) : data;

  fetch(`${server_url}/${url}`, {
    method: "POST",
    headers,
    body,
  })
    .then((raw) => raw.json())
    .then((result) => {
      success(result);
    })
    .catch((err) => {
      error(err);
    });
};

// GET Request
export const _get = (url, success = (f) => f, error = (f) => f) => {
  const token = localStorage.getItem("@@auth_token");
  fetch(`${server_url}/${url}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: token,
    },
  })
    .then((raw) => raw.json())
    .then((result) => {
      success(result);
    })
    .catch((err) => {
      error(err);
    });
};

// PUT Request
export const _put = (url, data, success = (f) => f, error = (f) => f) => {
  const token = localStorage.getItem("@@auth_token");
  fetch(`${server_url}/${url}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      authorization: token,
    },
    body: JSON.stringify(data),
  })
    .then((raw) => raw.json())
    .then((result) => {
      success(result);
    })
    .catch((err) => {
      error(err);
    });
};

// DELETE Request
export const _delete = (url, success = (f) => f, error = (f) => f) => {
  const token = localStorage.getItem("@@auth_token");
  fetch(`${server_url}/${url}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      authorization: `${token}`,
    },
  })
    .then((raw) => raw.json())
    .then((result) => {
      success(result);
    })
    .catch((err) => {
      error(err);
    });
};

// Utility Functions
// export function useQuery() {
//   return new URLSearchParams(useLocation().search);
// }

export function toCurrency(number) {
  return new Intl.NumberFormat("NGN", {
    style: "decimal",
    minimumFractionDigits: 2,
  }).format(number);
}

export function toWordsconver(s) {
  // Conversion logic for number to words
  const th_val = ["", "thousand", "million", "billion", "trillion"];
  const dg_val = [
    "zero",
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
  ];
  const tn_val = [
    "ten",
    "eleven",
    "twelve",
    "thirteen",
    "fourteen",
    "fifteen",
    "sixteen",
    "seventeen",
    "eighteen",
    "nineteen",
  ];
  const tw_val = [
    "twenty",
    "thirty",
    "forty",
    "fifty",
    "sixty",
    "seventy",
    "eighty",
    "ninety",
  ];

  if (!s) return "";
  s = s.toString().replace(/[\\, ]/g, "");
  if (isNaN(s)) return "not a number";

  let x_val = s.indexOf(".");
  if (x_val === -1) x_val = s.length;
  if (x_val > 15) return "too big";

  const n_val = s.split("");
  let str_val = "";
  let sk_val = 0;

  for (let i = 0; i < x_val; i++) {
    if ((x_val - i) % 3 === 2) {
      if (n_val[i] === "1") {
        str_val += tn_val[Number(n_val[i + 1])] + " ";
        i++;
        sk_val = 1;
      } else if (n_val[i] !== "0") {
        str_val += tw_val[n_val[i] - 2] + " ";
        sk_val = 1;
      }
    } else if (n_val[i] !== "0") {
      str_val += dg_val[n_val[i]] + " ";
      if ((x_val - i) % 3 === 0) str_val += "hundred ";
      sk_val = 1;
    }

    if ((x_val - i) % 3 === 1) {
      if (sk_val) str_val += th_val[(x_val - i - 1) / 3] + " ";
      sk_val = 0;
    }
  }

  if (x_val !== s.length) {
    str_val += "point ";
    for (let e = x_val + 1; e < s.length; e++) {
      str_val += dg_val[n_val[e]] + " ";
    }
  }

  return str_val.replace(/\s+/g, " ");
}

export function getShortName(sentence) {
  if (!sentence) return "";

  return sentence
    .split(/\s+/) // Split by spaces
    .map((word) => word.charAt(0).toUpperCase()) // Take first letter and capitalize
    .join(""); // Join letters to form abbreviation
}
export function getPosition(pos) {
  if (typeof pos !== "number" || pos < 1) return "";

  const j = pos % 10;
  const k = pos % 100;

  if (j === 1 && k !== 11) {
    return `${pos}st`;
  }
  if (j === 2 && k !== 12) {
    return `${pos}nd`;
  }
  if (j === 3 && k !== 13) {
    return `${pos}rd`;
  }
  return `${pos}th`;
}

export function toTitleCase(text) {
  if (!text || typeof text !== "string") return "";
  return text
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
export const getAlpha = (index) => {
  switch (index) {
    case 0:
      return "A";
    case 1:
      return "B";
    case 2:
      return "C";
    case 3:
      return "D";
  }
};

// export default useQuery;
