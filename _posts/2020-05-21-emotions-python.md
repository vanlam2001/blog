---
title: Python nhận diện cảm xúc 
date: 29/7/2021
layout: single
header:
   teaser: https://cdn.datafloq.com/cache/blog_pictures/878x531/face-detection-with-intel-distribution-for-python.png
---
[![Language](https://img.shields.io/badge/Lang-python-blue.svg)](https://www.python.org/)

## Giới thiệu 

Tác giả: niebardzo

Dự án được thực hiện như một phần của Luận văn Thạc sĩ về AGH. Mục đích của dự án là tạo ra ứng dụng nhận dạng cảm xúc với việc sử dụng các phương pháp Học máy. Để đạt được mục tiêu, một phần của tập dữ liệu Khuôn mặt cảm xúc được hướng dẫn bởi Karolinska ( KDEF ) đã được sử dụng. Bộ dữ liệu chứa các bức ảnh thể hiện từng cảm xúc (chỉ sử dụng hình ảnh chính diện - 980 mẫu; 140 mẫu cho mỗi cảm xúc). Để trích xuất thư viện dlib mốc khuôn mặt đã được sử dụng với mô hình được đào tạo trước để phát hiện mốc khuôn mặt

Máy dò mốc khuôn mặt có trong thư viện dlib là sự triển khai của Căn chỉnh khuôn mặt một phần nghìn giây với một bài báo về Cây hồi quy của Kazemi và Sullivan (2014). Bạn có thể tải xuống mốc này tại đây , cũng như nó được đưa vào kho lưu trữ dưới tên gọi models / shape.dat 

Phương pháp trích xuất các tính năng và chuẩn hóa đã được trình bày trong chương Trích xuất các tính năng. Các tính năng được trích xuất với nhãn là các đối tượng numpy được tuần tự hóa trong cơ sở dữ liệu thư mục . Mô hình phân loại cảm xúc cuối cùng được đăng nhiều kỳ dưới các mô hình / cảm xúc.joblib 

GitHub ([niebardzo/Emotions](https://github.com/niebardzo/Emotions))

## Các yêu cầu 
Phần mềm đã được thử nghiệm trên Ubuntu 18.04. * LTS với Python 3.6. * Được cài đặt.
Tất cả các yêu cầu khác được chỉ định trong `Pipfile` hoặc `tests.txt`. Cách tốt nhất để cài đặt là sử dụng `pipenv` nằm trong thư mục có `Pipfile`
```powershell
pipenv install --dev
pipenv shell
```
Hoặc sử dụng pip3 tiêu chuẩn:

```powershell
pip3 install --requirements
```
Để cài đặt đúng cách các thư viện dlib và OpenCV, vui lòng tham khảo các hướng dẫn do Adrian Rosebrock chuẩn bị từ [Pyimagesearch.com](https://www.pyimagesearch.com/)
+ [install-dlib-easy-complete-guide](https://www.pyimagesearch.com/2018/01/22/install-dlib-easy-complete-guide/)
+ [ubuntu-16-04-how-to-install-opencv](https://www.pyimagesearch.com/2016/10/24/ubuntu-16-04-how-to-install-opencv)


## Sử dụng
Để nhận biết cảm xúc, hãy sử dụng đường dẫn công cụ dự đoán mốc `Recog.py` và đường dẫn mô hình phân loại cảm xúc tuần tự 
Ví dụ

```powershell
python recognize.py -p models/shape.dat -m models/emotion.joblib
```
kết quả trong bản gif sau đây.

![demo](https://github.com/niebardzo/Emotions/raw/master/static/Demo.gif)

Để đào tạo mô hình khác bằng cách sử dụng các tính năng được trích xuất tuần tự, hãy sử dụng tập lệnh analyse.py . Cách sử dụng ví dụ:

```powershell
python analyze.py --action ts -p models/shape.dat -m naive_bayes
```
Để tự đào tạo mô hình phân loại biểu quyết, hãy sử dụng:

```powershell
python analyze.py --action tsv -p models/shape.dat
```
Để biết thêm các tùy chọn trong analyse.py, hãy xem trợ giúp:

```powershell
python analyze.py --help
```
Cảm xúc 
![](https://github.com/niebardzo/Emotions/raw/master/static/emotion_matrix.png)

## Tổng quan về giải pháp
Chương trình bày tổng quan về giải pháp. Mỗi chương mô tả phương pháp và / hoặc quy trình làm việc của từng bước đã được thực hiện như thế nào. Vui lòng xem các sơ đồ mô tả quy trình phát hiện cảm xúc tổng thể và sơ đồ mô tả quy trình đào tạo mô hình.

![](https://github.com/niebardzo/Emotions/raw/master/static/arch_diagram.png)

## Tính năng chiết xuất
Để phân tích đúng hình ảnh, các đặc điểm khuôn mặt phải được trích xuất. The Class Face đã được thực hiện để trích xuất các đặc điểm của khuôn mặt. Có 3 đặc điểm được chiết xuất cho từng vùng lông mày, 1 đặc điểm cho từng vùng mắt và 5 đặc điểm được chiết xuất cho vùng miệng, tổng cộng có 13 đặc điểm.

Các đặc điểm mô tả lông mày đã được trình bày trên hình ảnh dưới đây:

![1](https://github.com/niebardzo/Emotions/raw/master/static/eyebrows_f.png)

Dựa trên công trình của Soukupová và Čech trong bài báo năm 2016 của họ, Phát hiện nháy mắt theo thời gian thực bằng cách sử dụng Dấu vết trên khuôn mặt, các tính năng dành cho mắt đã được định nghĩa là EAR:

![2](https://github.com/niebardzo/Emotions/raw/master/static/EAR_f.jpg)

Tính năng tương tự đã được sử dụng để mô tả miệng, được gọi là MAR được mô tả trong A. Singh, C. Chandewar, P. Pattarkine, Hệ thống cảnh báo tài xế buồn ngủ với tính năng khai thác hiệu quả, Tạp chí quốc tế về nghiên cứu khoa học và công nghệ mới nổi Tập-5- 4 năm 2018.

![3](https://github.com/niebardzo/Emotions/raw/master/static/MAR_f.png)

Ngoài ra, đối với vùng miệng đã có các tính năng bổ sung được trích xuất:

![4](https://github.com/niebardzo/Emotions/raw/master/static/mouth_f.png)

Các tính năng không được biểu thị bằng tỷ lệ được chuẩn hóa bằng bộ chuẩn hóa sau:

![5](https://github.com/niebardzo/Emotions/raw/master/static/norm_f.png)

Các tính năng có các nhãn sau:

```python
self.feature_names = ['EARL','L1','L2','L3', 'EARR', 'R1', 'R2', 'R3', 'MAR', 'M1', 'M2', 'M3', 'M4']
```
Các tính năng được chuẩn hóa bằng bộ chuẩn hóa được tính toán dựa trên tổng khoảng cách euclide giữa điểm trọng tâm của khuôn mặt và tâm của mỗi mắt chia cho 2,0.

## Kỹ thuật tính năng

Điểm đầu tiên là trực quan hóa dữ liệu mà chúng tôi đã thu thập, vì mục đích đó, chúng tôi sử dụng chức năng của thư viện gạch vàng cho ML Visualization.

![6](https://github.com/niebardzo/Emotions/raw/master/static/init_data.png)

![7](https://github.com/niebardzo/Emotions/raw/master/static/init_paraller_coordinates.png)

và hình ảnh được phóng to:

![8](https://github.com/niebardzo/Emotions/raw/master/static/init_data_zoomed.png)

Như chúng ta có thể thấy, không có đủ độ rộng của dữ liệu để dễ dàng phân biệt giữa lớp cuối cùng phù hợp. Để xây dựng mô hình phù hợp, chúng ta nên tiến hành lựa chọn tính năng. Đầu tiên, chúng tôi đánh giá các tính năng nào có tương quan với nhau bằng cách đếm tương quan Pearson giữa các đối tượng địa lý.

![9](https://github.com/niebardzo/Emotions/raw/master/static/init_pearson.png)

Như chúng ta có thể thấy EAR bên trái và EAR bên phải sở hữu cùng một thông tin, đó là bởi vì tất cả các mặt của hình ảnh đều đối xứng. Cách tiếp cận tương tự có thể nhìn thấy ở khoảng cách giữa tâm mắt và lông mày đối với mắt trái và mắt phải. Kết luận cho điều đó là mô hình sẽ chỉ có giá trị đối với các mặt đối xứng. Hiện tại, chúng tôi có thể loại bỏ một nửa số đặc điểm đại diện cho một bên của khuôn mặt. Nhưng hãy tiến hành phân tích tính năng. Hãy kiểm tra mối tương quan của đối tượng địa lý với biến phụ thuộc:

![10](https://github.com/niebardzo/Emotions/raw/master/static/init_corelations.png)

Có thể thấy rằng chúng ta có thể loại bỏ 5 tính năng ít quan trọng nhất và sau đó xem dữ liệu lan rộng trở lại cho 8 tính năng:

![11](https://github.com/niebardzo/Emotions/raw/master/static/8_data.png)

![12](https://github.com/niebardzo/Emotions/raw/master/static/8_paraller.png)

và hình ảnh được phóng to:

![13](https://github.com/niebardzo/Emotions/raw/master/static/8_data_zoomed.png)

Ngoài ra, có vẻ tốt hơn nếu chúng ta coi những cảm xúc tức giận, buồn bã và sợ hãi là "không hài lòng" thì chúng ta có thể đạt được độ chính xác tốt hơn về cảm xúc đó.

Nói rằng luôn luôn có 8 tính năng sẽ được chọn trong số 13 tính năng ban đầu. Việc lựa chọn được thực hiện trong đường dẫn.

## Lựa chọn mô hình & Kiểm tra siêu tham số
Hầu hết các mô hình có sẵn trong Thư viện SKLearn để phân loại đã được thử nghiệm. Danh sách chi tiết có thể được tìm thấy dưới đây:

```python
ms = [
            "knn",
            "naive_bayes",
            "svm",
            "decision_tree",
            "random_forest",
            "extra_tree",
            "gradient_boost",
            "mlp"
        ]
```
Đối với mỗi phân loại, siêu tham số quan trọng nhất đã được đào bằng cách sử dụng lớp GridSearchCV () từ thư viện sklearn. Để dễ dàng hơn, lớp riêng biệt đã được thực hiện kế thừa từ lớp Model và điều chỉnh các siêu tham số cho mọi lớp trong Model.classes, với đầu vào là các tham số.

```python
params = {
        "knn": {"n_neighbors": np.arange(1,20,1), "weights": ["uniform", "distance"],
        "algorithm" : ["auto", "ball_tree", "kd_tree", "brute"]},
        "naive_bayes": {},
        "svm": {"kernel":["linear", "rbf"], "C": np.arange(0.1,50,0.5),
        "gamma": ['auto', 'scale']},
        "decision_tree": {"criterion": ["gini", "entropy"], "splitter": ["best", "random"], "max_depth": np.arange(5,300,1)},
        "random_forest": {"n_estimators": np.arange(20,300,3),"criterion": ["gini", "entropy"]},
        "extra_tree": {"n_estimators": np.arange(20,300,3),"criterion": ["gini", "entropy"]},
        "gradient_boost": {"n_estimators": np.arange(5,60,2), "learning_rate": np.arange(0.03,0.2,0.01)},
        "mlp": [{"hidden_layer_sizes": [ (i, ) for i in np.arange(6,20,1)], "alpha": np.arange(5e-06,5e-05,5e-06), "solver": ["lbfgs"]},
        {"hidden_layer_sizes": [ (i, j, ) for i in np.arange(4,18,1) for j in np.arange(8,20,1)],"alpha": np.arange(5e-06,5e-05,5e-06), "solver": ["lbfgs"]}
        ]
        }
```
Kết quả nằm trong tệp dưới static / results.csv .

Để có độ chính xác và điểm f1 tốt hơn, cuối cùng bộ phân loại bỏ phiếu đã được sử dụng với các bộ phân loại và trọng số từng phần sau:

```python
 def use_voting_classifier(self):
        """Method for changing to VotingClassifier."""
        self.model = VotingClassifier(estimators=[('naive_bayes', self.models["naive_bayes"]), ('et', self.models["extra_tree"]), ('gb', self.models["gradient_boost"])], voting='hard', weights=[2,3,1.5])
```
Bên dưới có Xác thực chéo ( độ chính xác của điểm số ) và Đường cong học tập cho Bộ phân loại bỏ phiếu.

![14](https://github.com/niebardzo/Emotions/raw/master/static/Cross_V_Voting.png)

![15](https://github.com/niebardzo/Emotions/raw/master/static/Learning_Curve_Voting.png)

Đường cong học tập của bộ phân loại bỏ phiếu khá xa so với đường cong điểm đào tạo, có nghĩa là có thể dễ dàng áp dụng nhiều dữ liệu đào tạo hơn cho mô hình.

## Kết quả
Trong chương này có các kết quả phân loại với Bộ phân loại biểu quyết đã được xác định trước đó. Dữ liệu đã được chia thành 20% dữ liệu kiểm tra và 80% dữ liệu đào tạo. Dưới đây, bạn có thể thấy phân phối dữ liệu (trước đây dữ liệu được phân phối đồng đều qua tất cả các lớp):

![16](https://github.com/niebardzo/Emotions/raw/master/static/Class_balance_after_splitting.png)

Báo cáo phân loại dưới đây cho thấy kết quả cuối cùng của việc phân loại.

![17](https://github.com/niebardzo/Emotions/raw/master/static/Voting_Classification_report.png)

và biểu đồ dự đoán lỗi cho mỗi lớp.

![18](https://github.com/niebardzo/Emotions/raw/master/static/Voting_class_prediction_error.png)

Ma trận bối rối cuối cùng trình bày kết quả của sự nhận biết cảm xúc đối với từng cảm xúc.

![](https://github.com/niebardzo/Emotions/raw/master/static/Confusion_Matrix.png)

## Contact

Nếu bạn muốn hỏi tôi một câu hỏi, xin vui lòng liên hệ với tác giả: pat049b@gmail.com 

## To Do

- [x] Viết một chuỗi doc cho mỗi lớp và mỗi phương thức trong utils.
- [x] Thực hiện Lựa chọn tính năng, thực hiện kiểm tra tầm quan trọng của đối tượng bằng cách vẽ biểu đồ.
- [x] Triển khai lựa chọn mô hình tốt với các chỉ số và lập biểu đồ - analyse.py -a tt
- [x] Kết thúc README - ghi lại bản demo, thêm bản vẽ và sơ đồ.



## Chúc May Mắn :D
