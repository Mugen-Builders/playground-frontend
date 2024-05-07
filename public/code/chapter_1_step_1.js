let queryNotices = `
query noticesByInput($inputIndex: Int!) {
  input(index: $inputIndex) {
    notices {
      edges {
        node {
          index
          input {
            index
          }
          payload
        }
      }
    }
  }
}
`

let queryReports = `
query reportsByInput($inputIndex: Int!) {
  input(index: $inputIndex) {
    reports {
      edges {
        node {
          index
          input {
            index
          }
          payload
        }
      }
    }
  }
}
`