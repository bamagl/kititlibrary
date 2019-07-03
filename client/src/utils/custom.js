fetch('/graphql123', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify("{books{isbn,_id}}")
  })
    .then(r => r.json())
    .then(data => console.log('data returned:', data));