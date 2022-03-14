import React, { useEffect, useState } from 'react';
import { useConnection } from '../utils/connection';
import NFTs from '@primenums/solana-nft-tools';
import ArrowBackIos from '@material-ui/icons/ArrowBackIos';
import DialogForm from '../components/DialogForm';
import { 
  Container,
  Button,
  Card,
  Typography,
  CardMedia,
  Box,
  Grid,
  Paper,
  CircularProgress,
  Link,  
  DialogTitle,
  DialogContent,
  DialogActions 
} from '@material-ui/core';
import {  
  useWallet,  
} from '../utils/wallet';
import WalletPage from './WalletPage';
import BalancesList from '../components/BalancesList';
import { useIsExtensionWidth } from '../utils/utils';

const styles = {
  mediaContainer: {
    position: 'relative',
    boxShadow: '0px 2px 3px rgba(20, 70, 150, 0.15)',
    borderRadius: '16px',
  },
  overlay: {
    top: 0,
    position: 'absolute',
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  overlayTextContainer:  {
    borderRadius: '20px',
    backgroundColor: 'rgba(34,34,34,0.8)',
    width: '100%',
    padding: '0 10px'
  },
  nftName:  {
    fontSize: '11px',
    lineHeight: '24px',
    fontWeight: '400',
  },
  image: {
    borderRadius: '16px',
  }
}

export default function NftPage() {
  const [data, dataSet] = useState(null)
  const conn = useConnection();  
  const wallet = useWallet();
  const [back, setBack] = useState(false);
  const [currentNft, setCurrentNft] = useState(false);
  const [detail, setDetail] = useState(false);

  const publicKey = wallet.publicKey.toString();  
  //const publicKey = 'EaeLkUWHDXBRcLfvBXhczgavxPtCBASYYXB9rBrYN1b6';
  
  const showDetail = (nft) => {
    setCurrentNft(nft);
    setDetail(true);
  }

  useEffect(() => {
    async function fetchMyAPI() {
      console.log(wallet.publicKey.toString());      
      const response = await NFTs.getNFTsByOwner(conn, publicKey);
      console.log(response);
      dataSet(response)
    }

    fetchMyAPI()
  }, [])

  if(back){
    return <BalancesList/>
  }

  return (
    <>
      <Paper style={{ display: data ? "block" : "none" }}>
        <Box style={{position:'relative'}} align="center" py={5} px={3}>
          <Box style={{position:'absolute', left:'15px', cursor: 'pointer'}} onClick={() => setBack(true)}>
            <Typography variant="h3"><ArrowBackIos/></Typography>
          </Box>
          <Typography variant="h3">NFTs</Typography>
        </Box>
        <Card>
          <Box style={{bgcolor: 'background.tokens', borderRadius: '20px 20px 0 0'}} px={2} py={2}>            
            { data && data.length > 0 && 
              <Grid container spacing={2}>
                {data.map((nft) => (
                  <Grid item xs={6}> 
                    <Link  
                      variant="body2"
                      component="button"
                      onClick={() => {
                        showDetail(nft)
                      }}
                    >
                      <Box style={styles.mediaContainer}>
                        <CardMedia style={styles.image} image={nft.image} component="img"/>  
                        <Box style={styles.overlay} p={1}>
                          <Box style={styles.overlayTextContainer}>
                            <Typography style={styles.nftName} variant='caption'>{nft.name}</Typography>
                          </Box>
                          
                        </Box>                             
                      </Box>   
                    </Link>                                       
                  </Grid>
                ))}  

                {data.map((nft) => (
                  <Grid item xs={6}> 
                    <Box style={styles.mediaContainer}>
                      <CardMedia style={styles.image} image={nft.image} component="img"/>  
                      <Box style={styles.overlay} p={1}>
                        <Box style={styles.overlayTextContainer}>
                          <Typography style={styles.nftName} variant='caption'>{nft.name}</Typography>
                        </Box>
                        
                      </Box>                             
                    </Box>                                          
                  </Grid>
                ))} 
                                {data.map((nft) => (
                  <Grid item xs={6}> 
                    <Box style={styles.mediaContainer}>
                      <CardMedia style={styles.image} image={nft.image} component="img"/>  
                      <Box style={styles.overlay} p={1}>
                        <Box style={styles.overlayTextContainer}>
                          <Typography style={styles.nftName} variant='caption'>{nft.name}</Typography>
                        </Box>
                        
                      </Box>                             
                    </Box>                                          
                  </Grid>
                ))} 
                                {data.map((nft) => (
                  <Grid item xs={6}> 
                    <Box style={styles.mediaContainer}>
                      <CardMedia style={styles.image} image={nft.image} component="img"/>  
                      <Box style={styles.overlay} p={1}>
                        <Box style={styles.overlayTextContainer}>
                          <Typography style={styles.nftName} variant='caption'>{nft.name}</Typography>
                        </Box>
                        
                      </Box>                             
                    </Box>                                          
                  </Grid>
                ))} 
                                {data.map((nft) => (
                  <Grid item xs={6}> 
                    <Box style={styles.mediaContainer}>
                      <CardMedia style={styles.image} image={nft.image} component="img"/>  
                      <Box style={styles.overlay} p={1}>
                        <Box style={styles.overlayTextContainer}>
                          <Typography style={styles.nftName} variant='caption'>{nft.name}</Typography>
                        </Box>
                        
                      </Box>                             
                    </Box>                                          
                  </Grid>
                ))} 
                                {data.map((nft) => (
                  <Grid item xs={6}> 
                    <Box style={styles.mediaContainer}>
                      <CardMedia style={styles.image} image={nft.image} component="img"/>  
                      <Box style={styles.overlay} p={1}>
                        <Box style={styles.overlayTextContainer}>
                          <Typography style={styles.nftName} variant='caption'>{nft.name}</Typography>
                        </Box>
                        
                      </Box>                             
                    </Box>                                          
                  </Grid>
                ))} 
                
              </Grid>    
            } 
            { data && data.length ==  0 && 
              <Box>
                <Typography variant='paragraph'>No collectibles for this account</Typography>
              </Box>
            }
          </Box>
        </Card>
        { detail &&
          <NftDetailDialog 
          open={detail}
          onClose={() => setDetail(false)}
          nft = {currentNft}
          />
        }
        
      </Paper>
      <Paper style={{ display: data ? " none" : "block" }}>     
        <Box align="center" p={10}>
          <CircularProgress disableShrink/>
        </Box>
      </Paper>
    </>
  )
}

function NftDetailDialog({ open, onClose, nft }) {
  return (
    <DialogForm
      open={open}
      onClose={onClose}    
      maxWidth='xs'              
    >
      
      <DialogContent style={{ maxWidth: '400px'}}>
        <Paper>
          <Box style={{position:'relative'}} align="center" py={5} px={1}>     
            <Box style={{position:'absolute', left:'15px', cursor: 'pointer'}} onClick={onClose}>
              <Typography variant="h3"><ArrowBackIos/></Typography>
            </Box>       
            <Typography variant="h3">NFT  {nft.name}</Typography>
          </Box>
          <Box >
            <Box>
              <CardMedia style={styles.mediaContainer} image={nft.image} component="img"/>                
            </Box>
            <Box my={1}>
              <Typography variant="paragraph">{nft.description}</Typography>
            </Box>  
            <Box align="center" style={{backgroundColor: '#4E4E4E', borderRadius:'10px'}} py={1}>
              <Box p={1}>
                <Typography variant="paragraph">Properties</Typography>
              </Box>
              <Box px={3}>
                <Typography variant="paragraph">
                  {nft.attributes.map((attribute) => {
                    return(
                      <><b>{attribute.trait_type}</b> {attribute.value} </>
                    )
                  })}
                </Typography>       
              </Box>
            </Box>
          </Box>
        </Paper>
      </DialogContent>      
    </DialogForm>
  );
}

