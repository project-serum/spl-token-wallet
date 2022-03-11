import React, { useEffect, useState } from 'react';
import { useConnection } from '../utils/connection';
import NFTs from '@primenums/solana-nft-tools';
import { Container, Button, Card, Typography, CardMedia, Box, Grid } from '@material-ui/core';
import {  
  useWallet,  
} from '../utils/wallet';


export default function NftPage() {
  const [data, dataSet] = useState(null)
  const conn = useConnection();  
  const wallet = useWallet();
  
  //const publicKey = wallet.publicKey.toString();
  
  const publicKey = 'EaeLkUWHDXBRcLfvBXhczgavxPtCBASYYXB9rBrYN1b6';
  
  useEffect(() => {
    async function fetchMyAPI() {
      console.log(wallet.publicKey.toString());      
      const response = await NFTs.getNFTsByOwner(conn, publicKey);
      console.log(response);
      dataSet(response)
    }

    fetchMyAPI()
  }, [])

  return (
    <Container maxWidth="xs">
      <Card>
        <Box px={2} py={6}>
          <Box my={3}>
            <Typography variant="h1">Collectibles</Typography>
          </Box>
          { data && data.length > 0 && 
            <Grid container spacing={3}>
              {data.map((nft) => (
                <Grid item xs={6}>                                  
                  <CardMedia image={nft.image} component="img"/>                      
                  <Typography variant="h4">{nft.name}</Typography>
                  <Typography variant="h4">{nft.description}</Typography>
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
    </Container>    

  )
}
