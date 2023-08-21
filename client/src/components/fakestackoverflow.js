//state manager
export default function fakeStackOverflow() {

    const header_bar = {
        backgroundColor: "#f8f9f9",
        boxShadow: "1px 1px 1px 1px #d3d3d3",
        borderColor: "#f1f1f1",
        height:"46px",
        top: "0px",
        left: '0px',
        width: '100%',
        zIndex: '5000',
        position: 'fixed'
    }

    const fake = {
        fontFamily: 'Gill Sans',
        left: '50%',
        transform: 'translateX(-579px) rotate(-52deg)',
        fontSize: '15px',
        top: '-8px',
        color: '#ff7300'
    }

    const stack = {
        fontFamily: 'Gill Sans',
        fontWeight: 'lighter',
        left: '50%',
        transform: 'translateX(-585px)',
        fontSize: '20px',
        top: '3px',
    }

    const overflow = {
        fontFamily: 'DIN Alternate',
        left: '50%',
        transform: 'translateX(-580px)',
        fontSize: '20px',
        top: '3px',
    }

    return(
        <div style={header_bar}>
        <h1 className={'fake_stack_overflow'} style={fake}> Fake </h1>
        <h1 className={'fake_stack_overflow'} style={stack}>stack</h1>
        <h1 className={'fake_stack_overflow'} style={overflow}>overflow</h1>
    </div>
    );
}
