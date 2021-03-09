import React, { useState, useCallback } from 'react'
import { useLocation, useHistory, Link, NavLink } from 'react-router-dom'
import { GridContainer, RowContainer, Row } from '../components/Common'

export const CardsPanel = ({ theme, setMarketAddress }) => {
  const location = useLocation()

  const isDarkTheme = theme.palette.type === 'dark'

  return (
    <ChartGridContainer isChartPage={false} theme={theme}>
      <RowContainer justify={'space-between'} height={'100%'}>
        <Row
          theme={theme}
          style={{
            // position: 'relative',
            display: 'flex',
            maxWidth: '75%',
            marginRight: '.4rem',
            flexGrow: 1,
            border: '0',
          }}
        >
          <Link
            to={'/chart/spot/SRM_USDT'}
            style={{
              padding: '1rem 0',
              height: '100%',
            }}
          >
            <img
              style={{
                height: '100%',
              }}
              src={isDarkTheme ? SerumCCAILogo : LightLogo}
            />
          </Link>
          <div
            style={{
              // width: '24%',
              marginLeft: '4rem',
              padding: '1rem 4rem 1rem 4rem',
              borderRight: theme.palette.border.main,
              borderLeft: theme.palette.border.main,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <NavLinkButton
              theme={theme}
              pathname={location.pathname}
              to="/chart"
              page={'chart'}
              component={(props) => <Link
                to={`/chart`}
                {...props}
              />
              }
            >
              Trading
            </NavLinkButton>
            <NavLinkButton
              theme={theme}
              data-tut="analytics"
              page={'analytics'}
              pathname={location.pathname}
              component={(props) => <Link
                  to={`/analytics/all`}
                  {...props}
                />
              }
            >
              {' '}
              Analytics
            </NavLinkButton>
            <NavLinkButton
              theme={theme}
              data-tut="farming"
              page={'addressbook'}
              pathname={location.pathname}
              component={(props) => <Link
                to={`/addressbook`}
                {...props}
              />
            }
            >
              {' '}
              Addressbook
            </NavLinkButton>
            <LinkBlock style={{ textDecoration: 'none' }} href="https://develop.wallet.cryptocurrencies.ai/">
              <NavLinkButton
                theme={theme}
                data-tut="farming"
                pathname={location.pathname}
                page={'wallet'}
              >
                {' '}
                Wallet
              </NavLinkButton>
            </LinkBlock>
          </div>
        </Row>
      </RowContainer>
    </ChartGridContainer>
  )
}