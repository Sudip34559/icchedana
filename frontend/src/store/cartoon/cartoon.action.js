import uploadFileTypes from "./cartoon.type";

//Type
import {
  DELETE_CARTOON,
  GET_CARTOON,
  INSERT_CARTOON,
  OPEN_CARTOON_DIALOG,
  UPDATE_CARTOON,
  CLOSE_CARTOON_TOAST,
  IS_NEW_RELEASE_SWITCH,
  DELETE_SWITCH,
  CARTOON_DETAILS,
  GET_TOP_10_CARTOON,
  GET_TOP_10_WEB_SERIES,
  GET_COMMENT,
  DELETE_COMMENT,
} from "./cartoon.type";

//axios
import axios from "axios";
import { Alert } from "antd";
import { Toast } from "../../util/Toast_";
import { baseURL, secretKey } from "../../util/config";
import { CLOSE_LOADER } from "../Loader/loader.type";
import { apiInstanceFetch } from "../../util/api";
import { setToast } from "../../util/Toast";

//Get CARTOON
export const getCartoon = (page, limit, search) => (dispatch) => {
  const requestOptions = {
    method: "GET",
    headers: { key: secretKey },
  };
  fetch(
    `${baseURL}movie/all?type=CARTOON&start=${page}&limit=${limit}&search=${search}`,
    requestOptions
  )
    .then((response) => response.json())
    .then((response) => {
      console.log(response);

      if (response.status) {
        dispatch({
          type: GET_CARTOON,
          payload: {
            movie: response.movie,
            totalMoviesWebSeries: response.totalMoviesWebSeries,
          },
        });
        dispatch({ type: CLOSE_LOADER });
      }
    })
    .catch((error) => {
      console.log("Error fetching CARTOON:", error);
    });
};

//get top 10 cartoon
export const getTop10Cartoon = () => (dispatch) => {
  apiInstanceFetch
    .get(`movie/AllTop10?type=CARTOON`)
    .then((res) => {
      dispatch({ type: GET_TOP_10_CARTOON, payload: res.movie });
    })
    .catch((error) => {
      console.log(error);
    });
};

//update cartoon
export const updateCartoon = (data, movieId) => (dispatch) => {
  console.log(data, movieId);

  axios
    .patch(`movie/update?movieId=${movieId}`, data)
    .then((res) => {
      if (res.status) {
        console.log("res.data.movie", res.data.movie);
        dispatch({
          type: UPDATE_CARTOON,
          payload: { data: res.data.movie, id: movieId },
        });

        // dispatch({
        //   type: OPEN_MOVIE_TOAST,
        //   payload: { data: "Update Movie Successful ✔", for: "update" },
        // });
        setToast("Update Movie Successful ✔", "update");
      } else {
        return res.data.message, "error";
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

//delete cartoon
export const deleteCartoon = (movieId) => (dispatch) => {
  axios
    .delete(`movie/delete?movieId=${movieId}`)
    .then((result) => {
      dispatch({ type: DELETE_CARTOON, payload: movieId });
    })
    .catch((error) => {
      console.log(error);
    });
};

//isNewRelease switch
export const newRelease = (movieId) => (dispatch) => {
  axios
    .patch(`movie/isNewRelease?movieId=${movieId}`)
    .then((res) => {
      if (res.data.status) {
        dispatch({
          type: IS_NEW_RELEASE_SWITCH,
          payload: { data: res.data.movie, id: movieId },
        });

        Toast("success", "Update Successfully");
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

//view cartoon details
export const viewDetails = (movieId) => (dispatch) => {
  apiInstanceFetch
    .get(`movie/details?movieId=${movieId}`)
    .then((result) => {
      dispatch({ type: CARTOON_DETAILS, payload: result.movie });
    })
    .catch((error) => {
      console.log(error);
    });
};

//get comment
export const getComment = (movieId, type) => (dispatch) => {
  apiInstanceFetch
    .get(`comment/getComments?movieId=${movieId}`)
    .then((res) => {
      if (res.status) {
        dispatch({ type: GET_COMMENT, payload: res.comment });
      } else {
        dispatch({ type: GET_COMMENT, payload: res.comment });
      }
    })
    .catch((error) => console.log("error", error.message));
};

//delete comment
export const deleteComment = (commentId) => (dispatch) => {
  axios
    .delete(`comment?commentId=${commentId}`)
    .then((res) => {
      if (res.status) {
        dispatch({ type: DELETE_COMMENT, payload: commentId });
      } else {
        console.log("error", res.message);
      }
    })
    .catch((error) => console.log("error", error.message));
};

export const setUploadFile = (data) => ({
  type: uploadFileTypes.SET_UPLOAD_FILE,
  payload: data,
});

export const setUploadProgress = (id, progress) => ({
  type: uploadFileTypes.SET_UPLOAD_PROGRESS,
  payload: {
    id,
    progress,
  },
});

export const successUploadFile = (id) => ({
  type: uploadFileTypes.SUCCESS_UPLOAD_FILE,
  payload: id,
});

export const failureUploadFile = (id) => ({
  type: uploadFileTypes.FAILURE_UPLOAD_FILE,
  payload: id,
});

export const uploadFile = (files, data, movieId, update) => (dispatch) => {
  if (files.length && data.videoType == 7) {
    files.map((file, index) => {
      if (!movieId) {
        const formPayload = new FormData();
        formPayload.append("videoType", data.videoType);
        formPayload.append("link", file.file);
        axios
          .post(
            `movie/getStore?TmdbMovieId=${data.tmdbMovieId}&type=CARTOON`,
            formPayload,
            {
              onUploadProgress: (progress) => {
                const { loaded, total } = progress;
                const percentageProgress = Math.floor((loaded / total) * 100);
                dispatch(setUploadProgress(file.id, percentageProgress));
              },
            }
          )
          .then((res) => {
            if (res.data.status) {
              dispatch(successUploadFile(file.id));
              Toast("success", "Insert Cartoon Successful ✔");
            } else {
              return res.data.message, "error";
            }
          })

          .catch((res) => {
            dispatch(failureUploadFile(file.id));
          });
      } else {
        const formPayload = new FormData();
        for (var i = 0; i < data.genres?.length; i++) {
          formPayload.append("genre", data.genres[i]);
        }

        formPayload.append("title", data.title);
        formPayload.append("description", data.description);
        formPayload.append("year", data.year);
        formPayload.append("image", data.image);
        formPayload.append("type", data.type);
        formPayload.append("thumbnail", data.thumbnail);
        formPayload.append("runtime", data.runtime);
        formPayload.append("videoType", data.videoType);
        formPayload.append("region", data.country);
        formPayload.append("link", file.file);

        axios
          .patch(`movie/update?movieId=${movieId}`, formPayload, {
            onUploadProgress: (progress) => {
              const { loaded, total } = progress;
              const percentageProgress = Math.floor((loaded / total) * 100);
              dispatch(setUploadProgress(file.id, percentageProgress));
            },
          })
          .then((res) => {
            dispatch(successUploadFile(file.id));

            if (res.status) {
              console.log(":::::::::::", res.data);

              dispatch({
                type: UPDATE_CARTOON,
                payload: { data: res.data.movie, id: movieId },
              });

              if (update == "update") {
                Toast("info", "Update Movie Successful ✔");
              }
            } else {
              return res.data.message, "error";
            }
          })
          .catch((error) => {
            dispatch(failureUploadFile(file.id));
            console.log(error);
          });
      }
    });
  }
  if (movieId && data.videoType != 7) {
    const formPayload = new FormData();
    for (var i = 0; i < data.genres?.length; i++) {
      formPayload.append("genre", data.genres[i]);
    }

    formPayload.append("title", data.title);
    formPayload.append("description", data.description);
    formPayload.append("year", data.year);
    formPayload.append("image", data.image);
    formPayload.append("type", data.type);
    formPayload.append("thumbnail", data.thumbnail);
    formPayload.append("runtime", data.runtime);
    formPayload.append("videoType", data.videoType);
    formPayload.append("region", data.country);
    formPayload.append("TmdbMovieId", data.TmdbMovieId);
    if (data.videoType == 0) {
      formPayload.append("link", data.youtubeUrl);
    } else if (data.videoType == 1) {
      formPayload.append("link", data.m3u8Url);
    } else if (data.videoType == 2) {
      formPayload.append("link", data.movUrl);
    } else if (data.videoType == 3) {
      formPayload.append("link", data.mp4Url);
    } else if (data.videoType == 4) {
      formPayload.append("link", data.mkvUrl);
    } else if (data.videoType == 5) {
      formPayload.append("link", data.webmUrl);
    } else {
      formPayload.append("link", data.embedUrl);
    }

    axios
      .patch(`movie/update?movieId=${movieId}`, formPayload)
      .then((res) => {
        if (res.data.status) {
          dispatch({
            type: UPDATE_CARTOON,
            payload: { data: res.data.movie, id: movieId },
          });

          if (update == "update") {
            Toast("info", "Update Cartoon Successful ✔");
          }
        } else {
          return res.data.message, "error";
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  if (!movieId && data.videoType != 7 && files.length === 0) {
    const formPayload = new FormData();
    formPayload.append("videoType", data.videoType);
    if (data.videoType == 0) {
      formPayload.append("link", data.youtubeUrl);
    } else if (data.videoType == 1) {
      formPayload.append("link", data.m3u8Url);
    } else if (data.videoType == 2) {
      formPayload.append("link", data.movUrl);
    } else if (data.videoType == 3) {
      formPayload.append("link", data.mp4Url);
    } else if (data.videoType == 4) {
      formPayload.append("link", data.mkvUrl);
    } else if (data.videoType == 5) {
      formPayload.append("link", data.webmUrl);
    } else {
      formPayload.append("link", data.embedUrl);
    }

    axios
      .post(
        `movie/getStore?TmdbMovieId=${data.tmdbMovieId}&type=CARTOON`,
        formPayload
      )
      .then((res) => {
        if (res.data.status) {
          dispatch({ type: INSERT_CARTOON, payload: res.data.movie });
          Toast("success", "Insert Movie Successful ✔");
        } else {
          return res.data.message, "error";
        }
      })
      .catch((error) => console.log(error));
  }
};

export const setUploadFileManual = (data) => ({
  type: uploadFileTypes.SET_UPLOAD_FILE_MANUAL,
  payload: data,
});

export const setUploadProgressManual = (id, progress) => ({
  type: uploadFileTypes.SET_UPLOAD_PROGRESS_MANUAL,
  payload: {
    id,
    progress,
  },
});

export const successUploadFileManual = (id) => ({
  type: uploadFileTypes.SUCCESS_UPLOAD_FILE_MANUAL,
  payload: id,
});

export const failureUploadFileManual = (id) => ({
  type: uploadFileTypes.FAILURE_UPLOAD_FILE_MANUAL,
  payload: id,
});

//create manual Cartoon
export const manualCartoon = (files, data) => (dispatch) => {
  if (files.length && data.videoType == 7) {
    files.map((file, index) => {
      const formPayload = new FormData();

      for (var i = 0; i < data.genres?.length; i++) {
        formPayload.append("genre", data.genres[i]);
      }
      formPayload.append("videoType", data.videoType);
      formPayload.append("link", file.file);
      formPayload.append("title", data.title);
      formPayload.append("description", data.description);
      formPayload.append("year", data.year);
      formPayload.append("region", data.country);
      formPayload.append("image", data.image);
      formPayload.append("type", data.type);
      formPayload.append("thumbnail", data.thumbnail);
      formPayload.append("runtime", data.runtime);
      formPayload.append("trailerName", data.trailerName);
      formPayload.append("trailerType", data.trailerType);
      formPayload.append("trailerVideoType", data.trailerVideoType);
      formPayload.append("trailerImage", data.trailerImage);
      formPayload.append(
        "trailerVideoUrl",
        data.trailerVideoType == 0 ? data.trailerVideoUrl : data.trailerVideo
      );

      axios
        .post(`movie/createCartoon`, formPayload, {
          onUploadProgress: (progress) => {
            const { loaded, total } = progress;
            const percentageProgress = Math.floor((loaded / total) * 100);
            dispatch(setUploadProgressManual(file.id, percentageProgress));
          },
        })
        .then((res) => {
          console.log(res);
          if (res.data.status) {
            dispatch(successUploadFileManual(file.id));
            Toast("success", "Insert Cartoon Successful ✔");
          } else {
            return res.data.message, "error";
          }
        })

        .catch((error) => {
          console.error("error", error);
          dispatch(failureUploadFileManual(file.id));
        });
    });
  }
};

export const createManual = (formData) => (dispatch) => {
  axios
    .post("movie/createCartoon", formData)
    .then((res) => {
      if (res.data.status) {
        Toast("success", "Cartoon Create  SuccessFully");
        dispatch({ type: INSERT_CARTOON, payload: res.data.movie });
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => {
      console.log("error", error);
    });
};
