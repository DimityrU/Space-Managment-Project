export function SortDate(array, property, ascending) {
  if (ascending) {
    return array.sort((a, b) => new Date(a[property]) - new Date(b[property]));
  }
  return array.sort((a, b) => new Date(b[property]) - new Date(a[property]));
}

export function SortNumeric(array, property, ascending) {
  if (ascending) {
    return array.sort((a, b) => a[property] - b[property]);
  }
  return array.sort((a, b) => b[property] - a[property]);
}

export function SortAlphabetic(array, property, ascending) {
  if (ascending) {
    return array.sort((a, b) => {
      const valueA = a[property] !== null ? a[property] : "zzz";
      const valueB = b[property] !== null ? b[property] : "zzz";
      return valueA.localeCompare(valueB);
    });
  }

  return array.sort((a, b) => {
    const valueA = a[property] !== null ? a[property] : "aaa";
    const valueB = b[property] !== null ? b[property] : "aaa";
    return valueB.localeCompare(valueA);
  });
}


export function SortTableColumn(sortedArray, column, sortType) {
  let sortButton = document.querySelector(`.${column}-sort`);
  let parent = sortButton.parentNode.parentNode;
  let activeSort = parent.querySelector(".active");
  if (!sortButton.classList.contains("active")) {
    activeSort.classList.remove("active");
    activeSort.classList.add("ascending");
    sortButton.classList.add("active");
  }
  let ascending = sortButton.classList.contains("ascending");

  switch (sortType) {
    case "numeric":
      SortNumeric(sortedArray, column, ascending);
      break;
    case "alphabetic":
      SortAlphabetic(sortedArray, column, ascending);
      break;
    case "date":
      SortDate(sortedArray, column, ascending);
      break;
  }
  ascending
    ? sortButton.classList.remove("ascending")
    : sortButton.classList.add("ascending");
}
