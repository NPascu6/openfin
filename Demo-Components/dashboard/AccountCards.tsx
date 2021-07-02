import {
    Avatar,
    Badge,
    Box,
    Card,
    CardContent,
    CardHeader,
    createStyles,
    Grid,
    IconButton,
    lighten,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    Paper,
    Theme,
    Tooltip,
    Typography,
} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import FingerprintIcon from "@material-ui/icons/Fingerprint";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import clsx from "clsx";
import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {amountFormatter, cryptoNumberFormatter, MINIMUM_QTY_DISPLAY} from "../../src/helpers/app";
import {getCurrencyByAssetCode} from "../../src/helpers/instrument";
import {Account, AccountType, Balance, TradeType} from "../../src/services/bookKeeper/models";
import {Currency} from "../../src/services/instrument/models";
import {RootState} from "../../src/redux/slices/rootSlice";

const lodash = require("lodash")

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        card: {
            paddingBottom: theme.spacing(1),
            display: "flex",
            flex: 1,
            overflow: "auto",
            flexDirection: "column",
        },
        cardContent: {
            display: "flex",
            overflow: "auto",
            flexDirection: "row",
            maxHeight: "20em",
            minHeight: "15.5em",
        },
        paperAsset: {
            padding: "1em",
            display: "flex",
            alignItems: "center",
            backgroundColor: lighten(theme.palette.background.paper, .1)
        },
        paperAssetIcon: {
            width: "3em",
            height: "3em"
        },
        paperAssetName: {
            fontWeight: "bolder",
            textAlign: "right",
        },
        paperAssetValue: {
            fontSize: "clamp(.7em, 10vw, 1rem)",
            width: "100%",
            height: "auto",
            fontWeight: "bold",
            textAlign: "right",
        },
        positive: {
            color: theme.palette.success.main,
        },
        negative: {
            color: theme.palette.error.main,
        },
        zero: {
            color: theme.palette.text.secondary
        },
        subheader: {
            textTransform: "capitalize",
        },
        avatar: {
            color: theme.palette.text.primary,
            backgroundColor: "transparent",
        },
    })
);

interface AssetBoxProps {
    account: Account;
    balance: any;
    currencies: Currency[];
}

const getVenue = (account: Account) => {
    switch (account.type) {
        case AccountType.Deposit:
            return "savings";
        case AccountType.Funding:
            return "funding";
        case AccountType.Trading:
            return account.venueCode;
    }

    return "I don't know you?"
};

const getTitle = (account: Account) => {
    switch (account.type) {
        case AccountType.Deposit:
            return "DEPOSIT";
        case AccountType.Funding:
            return "FUNDING";
        case AccountType.Trading:
            return account.venueCode.toUpperCase();
    }

    return "I don't know you?"
};

const getSubtitle = (account: Account) => {
    switch (account.type) {
        case AccountType.Deposit:
            return `${account.depositType} :: ${account.subType}`;
        case AccountType.Funding:
            return "Your Custody Vault";
        case AccountType.Trading:
            return `Trading :: ${account?.tradingAccountType?.toUpperCase()} :: ${account.tradeType}`
    }

    return "Who are you?"
};

const AssetBox = React.memo(({account, balance, currencies}: AssetBoxProps) => {
    const classes = useStyles();
    const amt = amountFormatter(balance.amount, balance.asset);
    const currency = getCurrencyByAssetCode(balance.asset, currencies);
    const currencyDescription = currency?.description ? currency.description : currency.name ? currency.name : ''

    let base, quote

    if (account.tradeType === TradeType.Swaps ||
        account.tradeType === TradeType.Options ||
        account.tradeType === TradeType.Futures) {
        base = balance.asset.split('-')[0]?.toLowerCase()
        quote = balance.asset.split('-')[1]?.toLowerCase()
    }

    return (
        <Paper elevation={1} className={clsx(classes.paperAsset)}>
            {
                currency.name.includes('-') ? <Badge
                        overlap="circle"
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                        badgeContent={
                            <div className={clsx("currency", quote, classes.paperAssetIcon)} style={{
                                width: 22,
                                height: 22
                            }}/>
                        }>
                        <div className={clsx("currency", base, classes.paperAssetIcon)}/>
                    </Badge> :
                    <div className={clsx("currency", balance.asset, classes.paperAssetIcon)}/>
            }
            <Box style={{flex: 1}}>
                <Typography variant="subtitle2" className={clsx(classes.paperAssetName)}>
                    <Tooltip
                        title={`(${!currency.code.includes('-') ? currency.code : currency.code.toUpperCase()}) ${!currencyDescription.includes('-') ? currencyDescription : currencyDescription.toUpperCase()}`}
                        aria-label={currencyDescription}
                        arrow
                        placement="top"
                    >
                        <div>{!currency.name.includes('-') ? currency.name : currency.name.toUpperCase()}</div>
                    </Tooltip>
                </Typography>
                <Typography
                    variant="caption"
                    noWrap
                    className={clsx(
                        classes.paperAssetValue,
                        balance.amount === 0 ? classes.zero : balance.amount > 0 ? classes.positive : classes.negative
                    )}
                >
                    <div>
                        <Tooltip title={balance.amount} aria-label="actual amount" arrow placement="right">
                            <Typography variant="h6">
                                {amt}
                            </Typography>
                        </Tooltip>
                    </div>
                    {account.type === AccountType.Deposit &&
                    (<div>
                        <Typography variant="subtitle2">
                            {`${cryptoNumberFormatter.format(parseFloat(account.balances.interest[balance.asset].toString()))}(${cryptoNumberFormatter.format(account.balances.apr[balance.asset] as number * 100)}%)`}
                        </Typography>
                    </div>)
                    }
                </Typography>
            </Box>
        </Paper>
    );
});

const AccountCardMenu = ({account}: { account: Account }) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleCopyAccountId = (id: string) => {
        navigator.clipboard.writeText(id).then(function () {
            console.log("Async: Copying to clipboard was successful!!", id);
        }, function (err) {
            console.error("Async: Could not copy text: ", err);
        });
        handleClose();
    };

    return (
        <>
            <IconButton aria-label="settings" onClick={handleClick}>
                <MoreVertIcon/>
            </IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose} keepMounted>
                <MenuItem onClick={() => handleCopyAccountId(account.id)}>
                    <ListItemIcon>
                        <FingerprintIcon fontSize="small"/>
                    </ListItemIcon>
                    <ListItemText primary="Copy Account Id"/>
                </MenuItem>
            </Menu>
        </>
    )
};

const AccountCard = ({account}: { account: Account }) => {
    const classes = useStyles();
    const currencies = useSelector((state: RootState) => state.instrument.currencies);
    const [balances, setBalances] = useState<Balance[]>([]);

    useEffect(() => {
        const tempBalances: Balance[] = [];
        Object.keys(account.balances.total).forEach((key) => {
            const amount = +account.balances.total[key];
            if (Math.abs(amount) > MINIMUM_QTY_DISPLAY || account.type === AccountType.Funding) {
                tempBalances.push({
                    asset: key,
                    amount: amount
                })
            }
        });
        setBalances(tempBalances);
    }, [account])

    return (
        <Card key={account.id} elevation={3} className={clsx(classes.card)}>
            <CardHeader
                avatar={
                    <Avatar variant="rounded" aria-label="account"
                            className={clsx(classes.avatar, "venue", getVenue(account))}>
                        &nbsp;
                    </Avatar>
                }
                action={<AccountCardMenu key={account.id} account={account}/>}
                title={getTitle(account)}
                subheader={getSubtitle(account)}
                classes={{subheader: classes.subheader}}
            />
            <CardContent className={clsx(classes.cardContent)}>
                <Grid container justify="flex-start" alignItems="flex-start" spacing={1}>
                    {balances.map(balance =>
                        (<Grid item xs={12} md={6} lg={4} key={`${account.id}-${balance.asset}`}>
                            <AssetBox account={account} balance={balance} currencies={currencies ? currencies : []}/>
                        </Grid>)
                    )}
                </Grid>
            </CardContent>
        </Card>
    );
};

const AccountCards = () => {
    const activeFund = useSelector((state: RootState) => state.bookkeeper.activeFund);
    const [accounts, setAccounts] = useState<Account[]>([]);

    useEffect(() => {
        if (!activeFund?.accounts) return;
        setAccounts(activeFund.accounts.filter((a) => !lodash.isEmpty(a?.balances?.available) && !lodash.isEmpty(a.balances.total)));
    }, [activeFund]);

    return (
        <>
            {accounts?.map((account) => (
                <Grid container item xs={12} md={6} lg={6} key={`card-${account.id}`}>
                    <AccountCard account={account}/>
                </Grid>
            ))}
        </>
    );
};

export default React.memo(AccountCards);
