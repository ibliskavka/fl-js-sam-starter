import { useFormik } from "formik";
import React, { useContext, useEffect, useState } from "react";
import { Button, Form, Grid, Message, Segment } from "semantic-ui-react";
import { IProfileRegion } from "../api-interfaces";
import AppContext from "../contexts/AppContext";
import {
    SourceProfileSelector,
} from "./base/Questions";


export const Home = () => {
    const [disabled, setDisabled] = useState(false);
    const [sourceProfile, setSourceProfile] = useState<IProfileRegion>({profile: "", region: ""});
    const [targetProfile, setTargetProfile] = useState<IProfileRegion>({profile: "", region: ""});


    const ctx = useContext(AppContext);


    // useEffect(() => {
    //     setDisabled(countResult.loading || previewResult.loading || exportResult.loading);
    // }, [countResult.loading, previewResult.loading, exportResult.loading]);

    if (ctx.groups.length === 0) {
        return <Grid container centered>
            <Message error>
                <Message.Header>Error</Message.Header>
                <Message.Content>You are not assigned to any user groups. Please contact your administrator.</Message.Content>
            </Message>
        </Grid>
    }

    // const CountBlock = () => {
    //     return (
    //         <Grid.Column>
    //             <Segment loading={disabled}>
    //                 <Message info>
    //                     <p>Query Result Count: {countResult.result === -1 ? "" : countResult.result.toLocaleString()} <br />
    //                         <small>Must be less than {exportCountMax.toLocaleString()} to export</small></p>
    //                 </Message>
    //                 <Button
    //                     disabled={countResult.loading}
    //                     color={"green"}
    //                     type="button"
    //                     onClick={() => {
    //                         formik.setFieldValue("action", "count");
    //                         formik.handleSubmit();
    //                     }}
    //                 >Count</Button>
    //                 <Message error visible={countResult.error ? true : false}>
    //                     <p>{countResult.error}</p>
    //                 </Message>
    //             </Segment>
    //         </Grid.Column>);
    // }

    // const PreviewBlock = () => {
    //     return (
    //         <Grid.Column>
    //             <Segment loading={disabled}>
    //                 <PreviewLimitQuestion formik={formik} disabled={disabled} />
    //                 <Button
    //                     disabled={disabled || countResult.result > exportCountMax}
    //                     type="button"
    //                     color={"yellow"}
    //                     onClick={() => {
    //                         formik.setFieldValue("action", "preview");
    //                         formik.handleSubmit();
    //                     }}
    //                     content="Preview Results"
    //                 />
    //                 <Message error visible={previewResult.error ? true : false} onDismiss={() => setPreviewQuery(null)}>
    //                     <p>{previewResult.error}</p>
    //                 </Message>
    //             </Segment>
    //         </Grid.Column>
    //     );
    // }

    // const ExportBlock = () => {

    //     return (
    //         <Grid.Column>
    //             <Segment loading={disabled}>
    //                 <ExportLimitQuestion formik={formik} disabled={disabled} />
    //                 <Button
    //                     color={"red"}
    //                     disabled={disabled || countResult.result > exportCountMax}
    //                     type="button"
    //                     onClick={() => {
    //                         formik.setFieldValue("action", "export");
    //                         formik.handleSubmit();
    //                     }}
    //                     content="Export to VAMS"
    //                 />
    //                 <Message error visible={exportResult.error ? true : false} onDismiss={() => setExportQuery(null)}>
    //                     <p>{exportResult.error}</p>
    //                 </Message>
    //                 {exportResult.result
    //                     && <Message success>
    //                         <p>Export Generated: {exportResult.result}</p>
    //                     </Message>}
    //             </Segment>
    //         </Grid.Column>
    //     )
    // }

    return (
        <React.Fragment>
            <Grid container stackable columns={2}>
                <Grid.Column width={16}>
                    <Message info>
                        <Message.Header>Instructions</Message.Header>
                        <Message.Content>
                            <ul>
                                <li>TBD</li>
                            </ul>
                        </Message.Content>
                    </Message>
                </Grid.Column>
                <Grid.Column>
                    <Segment>
                        <h4>Source</h4>
                        <SourceProfileSelector disabled={disabled} onChanged={(val) => setSourceProfile(val)} />
                    </Segment>
                </Grid.Column>
                <Grid.Column>
                    <Segment>
                        <h4>Target</h4>
                        <SourceProfileSelector disabled={disabled} onChanged={(val) => setTargetProfile(val)} />
                    </Segment>
                </Grid.Column>
            </Grid>
        </React.Fragment>
    );
};
