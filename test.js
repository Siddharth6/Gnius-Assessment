tempdata.save().then((d) => {
    res.json({
        success : true,
        message : `New testpaper created successfully!`,
        testid : d._id
    });
})
.catch((err)=>{
    // console.log(err);
    res.status(500).json({
        success : false,
        message : "Unable to create new testpaper!"
    });
});


<ul style={{ listStyle: 'none' }}>
                                
                                <li style={{ padding: '5px' }}>
                                  Skills : {'    '}
                                  {loading ? jobs.skillsets.map((skill) => (
                                    <Chip label={skill} style={{ marginRight: "5px" }} />
                                  )) : null}
                                </li>
                                          
                                <li style={{ padding: '5px' }}>
                                  Posted By: {recruiter.name}
                                </li>
          
                                          
                                          
                                <li style={{ padding: '5px' }}>
                                  Job Id: {id}
                                </li>
                                          
                                
                                          
                                
                                
                                <li>
                                  <div className="Demo__container">
                                    
                                    <div className="Demo__some-network">
                                      <CopyToClipboard
                                        text={url}
                                        onCopy={() => message.success('Link Copied to clipboard')}>
                                        <Icon style={{ fontSize: '150%', marginTop: '7px'}} type="share-alt" />
                                      </CopyToClipboard>
                                    </div>
                                    
                                    <div className="Demo__some-network">
                                      <FacebookShareButton
                                        url={url}
                                        quote={jobs.title}
                                        className="Demo__some-network__share-button"
                                      >
                                        <FacebookIcon size={32} round />
                                      </FacebookShareButton>
          
                                      <div>
                                        <FacebookShareCount url={url} className="Demo__some-network__share-count">
                                          {count => count}
                                        </FacebookShareCount>
                                      </div>
                                    </div>
          
                                    <div className="Demo__some-network">
                                      <TwitterShareButton
                                        url={url}
                                        title={jobs.title}
                                        className="Demo__some-network__share-button"
                                      >
                                        <TwitterIcon size={32} round />
                                      </TwitterShareButton>
          
                                      <div className="Demo__some-network__share-count">&nbsp;</div>
                                    </div>
          
                                    <div className="Demo__some-network">
                                      <TelegramShareButton
                                        url={url}
                                        title={jobs.title}
                                        className="Demo__some-network__share-button"
                                      >
                                        <TelegramIcon size={32} round />
                                      </TelegramShareButton>
          
                                      <div className="Demo__some-network__share-count">&nbsp;</div>
                                    </div>
          
                                    <div className="Demo__some-network">
                                      <WhatsappShareButton
                                        url={url}
                                        title={jobs.title}
                                        separator=":: "
                                        className="Demo__some-network__share-button"
                                      >
                                        <WhatsappIcon size={32} round />
                                      </WhatsappShareButton>
                                      <div className="Demo__some-network__share-count">&nbsp;</div>
                                    </div>
          
                                    <div className="Demo__some-network">
                                      <LinkedinShareButton url={url} className="Demo__some-network__share-button">
                                        <LinkedinIcon size={32} round />
                                      </LinkedinShareButton>
                                    </div>
                                        
                                </div>
                                </li>
                              </ul>