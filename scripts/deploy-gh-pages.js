import gh from 'gh-pages'

gh.publish('docs', (err)=>{
    if(err) {
        console.error("deploy to gh-pages error: ", err)
    }
})
