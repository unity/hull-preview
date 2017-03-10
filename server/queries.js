export function name(query) {
  return {
    query: {
      multi_match: {
        query,
        fields: ["name", "name.exact"],
        fuzziness: "AUTO"
      }
    },
    sort: {
      created_at: "asc"
    },
    raw: true,
    page: 1,
    per_page: 1
  };
}

export function id(query) {
  return {
    filter: {
      filtered: {
        query: { match_all: {} },
        filter: { and: { filters: [{ terms: { id: [query] } }] } }
      }
    },
    sort: {
      created_at: "asc"
    },
    raw: true,
    page: 1,
    per_page: 1
  };
}

export function email(query) {
  return {
    query: {
      multi_match: {
        type: "phrase_prefix",
        query,
        operator: "and",
        fields: ["email.exact^2"]
      }
    },
    sort: {
      created_at: "asc"
    },
    raw: true,
    page: 1,
    per_page: 1
  };
}
