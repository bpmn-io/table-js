
function newSet() {
  return {
    elements: [],
    index: {}
  };
}

function add(set, element) {

  const {
    elements,
    index
  } = set;

  if (index[element]) {
    return set;
  } else {
    return {
      elements: [ ...elements, element ],
      index: {
        ...index,
        [element]: true
      }
    };
  }
}

function join(set, separator) {
  return set.elements.join(separator);
}

export default function classNames(...args) {

  let set = newSet();

  args.forEach(function(item) {
    const type = typeof item;

    if (type === 'string' && item.length > 0) {
      set = add(set, item);
    } else if (type === 'object' && item !== null) {

      Object.keys(item).forEach(function(key) {
        const value = item[key];

        if (value) {
          set = add(set, key);
        }
      });
    }
  });

  return join(set, ' ');
}